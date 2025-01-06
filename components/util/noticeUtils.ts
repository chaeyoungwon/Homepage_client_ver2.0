import { authInstance } from '@/api/auth/axios';
import { Comment } from '../notice/dto';

export const createCommentOrReply = async (
  postId: number,
  text: string,
  user: string,
  parentCommentId?: string | number
): Promise<{ data: Comment }> => {
  try {
    const response = await authInstance.post(`/comment/${postId}/create`, {
      user,
      content: text,
      ...(parentCommentId !== undefined && { parentCommentId }),
    });

    return { data: response.data };
  } catch (error) {
    console.error('댓글/답글 작성 API 요청 실패:', error);
    throw error;
  }
};

export const addCommentOrReply = async (
  postId: number,
  text: string,
  user: string,
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
  setChatCount: React.Dispatch<React.SetStateAction<number>>,
  setText: React.Dispatch<React.SetStateAction<string>>,
  parentCommentId?: string | number,
  setReplyingToId?: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (text.trim() === '') return;

  try {
    const response = await createCommentOrReply(
      postId,
      text,
      user,
      parentCommentId
    );
    const newCommentOrReply = response.data;
    setComments((prevComments) => {
      if (parentCommentId) {
        return prevComments.map((comment) =>
          comment.id === parentCommentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), newCommentOrReply],
              }
            : comment
        );
      } else {
        return [newCommentOrReply, ...prevComments];
      }
    });

    setText('');
    setChatCount((prev) => prev + 1);
    if (setReplyingToId) setReplyingToId(null);
  } catch (error) {
    console.error('댓글/답글 작성 실패:', error);
  }
};

export const handleDeleteCommentOrReply = async (
  id: string,
  postId: number,
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
  setChatCount: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const response = await authInstance.patch(
      `/comment/${postId}/${id}/delete`
    );

    setComments((prevComments) => {
      let updatedComments = [...prevComments];
      let deletedCommentCount = 0;

      updatedComments = updatedComments
        .map((comment) => {
          if (comment.id === id) {
            const hasReplies =
              (comment.replies ? comment.replies.length : 0) > 0 ||
              prevComments.some((c) => c.parentCommentId === id);

            if (hasReplies) {
              setChatCount((prev) => Math.max(0, prev - 1));

              return {
                ...comment,
                deletedAt: new Date().toISOString(),
                content: '삭제된 댓글입니다.',
                user: '',
              };
            } else {
              deletedCommentCount++;
              return null;
            }
          }

          return comment;
        })
        .filter((comment): comment is Comment => comment !== null);

      return updatedComments;
    });
  } catch (error) {
    console.error('❌ 삭제 실패:', error);
  }
};

export const handleDeleteConfirm = (
  setShowDeletePopup: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setShowDeletePopup(false);
};

export const handleDeleteCancel = (
  setShowDeletePopup: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setShowDeletePopup(false);
};
