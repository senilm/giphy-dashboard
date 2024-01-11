const Button = ({ label, onClickHandler }) => {
  return (
    <button
      className="bg-gray-50 px-2 border-white rounded mx-[0.1rem]"
      onClick={onClickHandler}
    >
      <span className="text-xs">
      {label}
      </span>
    </button>
  );
};

export default Button