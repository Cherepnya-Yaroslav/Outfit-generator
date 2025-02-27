import { useState, useEffect } from "react";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
import ClothesCard from "./ClothesCard.jsx";
import "./App.css";
import ButtonGen from "./ButtonGen.jsx";

function GalleryApp() {
    const [savedOutfits, setSavedOutfits] = useState([]);

    // Загружаем сохраненные аутфиты при загрузке страницы
    useEffect(() => {
        const outfits = JSON.parse(localStorage.getItem("outfits")) || [];
        setSavedOutfits(outfits);
    }, []);

    const deleteOutfit = (index) => {
        const updatedOutfits = savedOutfits.filter((_, i) => i !== index);
        setSavedOutfits(updatedOutfits);
        localStorage.setItem("outfits", JSON.stringify(updatedOutfits));
    };

    return (
        <div className="app-container">
            <Nav />
            {savedOutfits.length === 0 ? (
                <h2 className="yourLooksH2">У вас пока нет сохраненных аутфитов</h2>
            ) : (
                <>
                    <h2 className="yourLooksH2">Ваши луки</h2>
                <div className="galleryOutfits">
                    {savedOutfits.map((outfit, index) => (
                        <div key={index} className="outfit-card">
                            <h3>Аутфит {index + 1}</h3>
                            <div className="outfitHolder">
                                <ClothesCard img={outfit.top.src} />
                                <ClothesCard img={outfit.bottom.src} />
                                <ClothesCard img={outfit.shoes.src} />
                                <ButtonGen text="Удалить" func={()=>deleteOutfit(index)}></ButtonGen>
                            </div>
                        </div>
                    ))}
                </div>
                </>
            )}

            <div className="btn-container">
                <button className="startBtn" onClick={() => window.location.href = "/"}>Назад</button>
            </div>

            <Footer />
        </div>
    );
}

export default GalleryApp;
