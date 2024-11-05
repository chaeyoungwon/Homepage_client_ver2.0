import { useState } from "react";
import Modal from "../ui/Modal"

interface ModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => (

    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p className="font-semibold text-[24px]">
            가입 신청 완료
        </p>
        <p className="font-medium text-[18px] mt-[24px]">
            깔루아 가입 신청이 완료되었습니다.<br/>
            관리자 승인 이후 가입이 완료된 분께서는<br/>
            KAHLUA 전용 서비스를 자유롭게 이용하실 수 있습니다.
        </p>
    </Modal>
)

export default LoginModal;