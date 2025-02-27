import { useState, useEffect } from "react";
import Nav from "./Nav.jsx";
import ButtonGen from "./ButtonGen.jsx";
import Footer from "./Footer.jsx";
import ClothesCard from "./ClothesCard.jsx";
import "./App.css";

function App() {
    // Инициализация состояний с загрузкой из localStorage
    const [topItems, setTopItems] = useState(() => JSON.parse(localStorage.getItem("topItems")) || []);
    const [botItems, setBotItems] = useState(() => JSON.parse(localStorage.getItem("botItems")) || []);
    const [shoesItems, setShoesItems] = useState(() => JSON.parse(localStorage.getItem("shoesItems")) || []);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [outfit, setOutfit] = useState(null);
    const [isGenerated, setIsGenerated] = useState(false);

    // Сохраняем вещи в localStorage при изменении
    useEffect(() => {
        localStorage.setItem("topItems", JSON.stringify(topItems));
        localStorage.setItem("botItems", JSON.stringify(botItems));
        localStorage.setItem("shoesItems", JSON.stringify(shoesItems));
    }, [topItems, botItems, shoesItems]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!selectedCategory) {
            alert("Пожалуйста, выберите категорию перед загрузкой!");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const newItem = { id: Date.now(), src: reader.result };

            if (selectedCategory === "верх") {
                setTopItems((prevItems) => [...prevItems, newItem]);
            } else if (selectedCategory === "низ") {
                setBotItems((prevItems) => [...prevItems, newItem]);
            } else if (selectedCategory === "обувь") {
                setShoesItems((prevItems) => [...prevItems, newItem]);
            }
        };
        reader.readAsDataURL(file);
    };

    const resetImages = () => {
        setTopItems([]);
        setBotItems([]);
        setShoesItems([]);
        localStorage.removeItem("topItems");
        localStorage.removeItem("botItems");
        localStorage.removeItem("shoesItems");
    };

    const generateOutfit = () => {
        if (!topItems.length || !botItems.length || !shoesItems.length) {
            alert("Добавьте вещи во все категории!");
            return;
        }

        const randomTop = topItems[Math.floor(Math.random() * topItems.length)];
        const randomBottom = botItems[Math.floor(Math.random() * botItems.length)];
        const randomShoes = shoesItems[Math.floor(Math.random() * shoesItems.length)];

        setOutfit({ top: randomTop, bottom: randomBottom, shoes: randomShoes });
        setIsGenerated(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const saveOutfit = () => {
        if (!outfit) return;
        const savedOutfits = JSON.parse(localStorage.getItem("outfits")) || [];
        localStorage.setItem("outfits", JSON.stringify([...savedOutfits, outfit]));
    };

    return (
        <div className="app-container">
            <Nav />

            {!isGenerated ? (
                <>
                    <h2 className="yourLooksH2">Добавьте свои вещи</h2>
                    <div className="btn-container">
                        <ButtonGen text="Выберете верх" func={() => handleCategorySelect("верх")} />
                        <ButtonGen text="Выберете низ" func={() => handleCategorySelect("низ")} />
                        <ButtonGen text="Выберете обувь" func={() => handleCategorySelect("обувь")} />
                    </div>

                    <div className="btn-container marginMinus30px">
                        <label className="startBtn">
                            Добавьте файл
                            <input type="file" className="file-input" onChange={handleUpload} />
                        </label>
                        <ButtonGen text="Сбросить изображения" func={()=> resetImages()}></ButtonGen>
                    </div>

                    <div className="uploadedClothes ">
                        <h3>Загруженные вещи:</h3>
                        <div className="categoryClothes">
                            <h3>Верх</h3>
                            {topItems.map((item) => (
                                <ClothesCard key={item.id} img={item.src} />
                            ))}
                        </div>
                        <div className="categoryClothes">
                            <h3>Низ</h3>
                            {botItems.map((item) => (
                                <ClothesCard key={item.id} img={item.src} />
                            ))}
                        </div>
                        <div className="categoryClothes">
                            <h3>Обувь</h3>
                            {shoesItems.map((item) => (
                                <ClothesCard key={item.id} img={item.src} />
                            ))}
                        </div>
                    </div>

                    <div className="btn-container">
                        <ButtonGen text="Сгенерировать аутфит" func={generateOutfit} />
                    </div>
                </>
            ) : (
                <>
                    <h3 className="yourLooksH2">Ваш аутфит</h3>
                    <div className="outfitHolder">
                        <ClothesCard img={outfit.top.src} />
                        <ClothesCard img={outfit.bottom.src} />
                        <ClothesCard img={outfit.shoes.src} />
                    </div>

                    <div className="btn-container">
                        <ButtonGen text="Сохранить аутфит в галерею" func={() => saveOutfit() } />
                        <ButtonGen text="Сгенерировать еще раз" func={generateOutfit} />
                    </div>
                </>
            )}

            <Footer />
        </div>
    );
}

export default App;
