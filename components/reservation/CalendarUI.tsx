import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 기본 스타일
import './CalendarUI.css';

// react-calnedar에서 요구하는 타입 형식 (변경 x)
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarProps {
  onSelectDate: (date: Date) => void;
}

const CalendarUI = ({ onSelectDate }: CalendarProps) => {
  const [value, setValue] = useState<Value>(null);

  const handleDateChange = (newValue: Value) => {
    setValue(newValue);
    // 상위 컴포넌트에 전달
    if (newValue instanceof Date) {
      onSelectDate(newValue);
      // console.log(newValue);
    }
  };

  const isSelectable = (date: Date): boolean => {
    const today = new Date();
    const day = date.getDay();
    const twoWeeksFromToday = new Date(today);
    twoWeeksFromToday.setDate(today.getDate() + 14);

    // 오늘 이전 날짜는 비활성화
    if (date < today) return false;

    // 오늘 기준 2주 이후 날짜는 비활성화
    if (date > twoWeeksFromToday) return false;

    // 화(2), 수(3), 토(6)만 활성화
    return day === 2 || day === 3 || day === 6;
  };


  return (
    <div className="mt-10">
      <p className="text-black font-normal text-xl pad:text-2xl mb-6">
        날짜와 시간을 선택해주세요
      </p>
      <Calendar
        onChange={handleDateChange}
        value={value}
        locale="ko"
        calendarType="gregory"
        formatDay={(locale, date) => `${date.getDate()}`}
        navigationLabel={({ date }) => `${date.getFullYear()}.${date.getMonth() + 1}`}
        prevLabel="<"
        nextLabel=">"
        tileDisabled={({date}) => !isSelectable(date)}
      />
    </div>
  );
};

export default CalendarUI;