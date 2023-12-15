

function GenderSelector({ selectedGender, onChange }) {
    const handleGenderChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div  className={"mt-5"}>
            <div className={"font"}>Tìm kiếm</div>
            <select className={"w-1/3 rounded-lg border-2"} value={selectedGender} onChange={handleGenderChange}>
                <option className={"mt-1"} value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
            </select>
        </div>
    );
}

export default GenderSelector;
