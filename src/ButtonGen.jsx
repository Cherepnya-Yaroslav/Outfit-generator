import { useState } from "react";

function ButtonGen(props) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [activeButton, setActiveButton] = useState(""); // Состояние для анимации кнопки

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setActiveButton(category);

        setTimeout(() => {
            setActiveButton(""); // Убираем эффект через 300ms
        }, 1500);
    };

    return (
        <button
            className={`startBtn ${props.text === activeButton ? "activeBtn" : ""}`}
            onClick={() => {
                handleCategorySelect(props.text);
                props.func(); // Вызываем переданную функцию
            }}
        >
            {props.text}
        </button>
    );
}

export default ButtonGen;
