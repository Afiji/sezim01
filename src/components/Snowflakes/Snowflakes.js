import { useEffect } from "react";
import s from "./Snowflakes.module.scss";

const Snowflakes = () => {
  useEffect(() => {
    const numberOfSnowflakes = 300;

    for (let i = 0; i < numberOfSnowflakes; i++) {
      const snowflake = document.createElement("div");
      snowflake.className = s.snowflake;

      // Установка случайного начального положения снежинки по горизонтали
      const position = Math.random() * window.innerWidth;
      snowflake.style.left = `${position}px`;

      // Установка случайного начального положения снежинки по вертикали
      snowflake.style.top = `${-10 + Math.random() * 20}px`; // Случайное значение от -10 до 10px

      // Установка случайной продолжительности анимации падения
      snowflake.style.animationDuration = `${5 + Math.random() * 10}s`; // Случайное значение от 5 до 15 секунд

      // Установка случайной задержки начала анимации
      snowflake.style.animationDelay = `${Math.random() * 5}s`; // Случайное значение от 0 до 5 секунд

      document.body.appendChild(snowflake);
    }

    return () => {
      document.querySelectorAll(`.${s.snowflake}`).forEach((el) => el.remove());
    };
  }, []);

  return null;
};

export default Snowflakes;
