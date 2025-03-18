import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/layout/Nav.jsx";
import Footer from "../components/layout/Footer.jsx";
import ClothesCard from "../components/ui/ClothesCard.jsx";
import ButtonGen from "../components/ui/ButtonGen.jsx";
import "../styles/App.css";

function GalleryApp() {
    const navigate = useNavigate();
    const [savedOutfits, setSavedOutfits] = useState([]);

    useEffect(() => {
        try {
            const savedData = localStorage.getItem("outfits");
            if (savedData) {
                const outfits = JSON.parse(savedData);
                setSavedOutfits(outfits);
            }
        } catch (error) {
            console.error("Error loading outfits:", error);
            setSavedOutfits([]);
        }
    }, []);

    const deleteOutfit = (index) => {
        try {
            const updatedOutfits = savedOutfits.filter((_, i) => i !== index);
            setSavedOutfits(updatedOutfits);
            localStorage.setItem("outfits", JSON.stringify(updatedOutfits));
            alert("Аутфит удален!");
        } catch (error) {
            console.error("Error deleting outfit:", error);
            alert("Произошла ошибка при удалении аутфита");
        }
    };

    return (
        <div className="app-container">
            <Nav />
            {!savedOutfits || savedOutfits.length === 0 ? (
                <>
                    <h2 className="yourLooksH2">У вас пока нет сохраненных аутфитов</h2>
                    <div className="btn-container">
                        <ButtonGen text="Вернуться и создать аутфит" func={() => navigate('/')} />
                    </div>
                </>
            ) : (
                <>
                    <h2 className="yourLooksH2">Ваши луки</h2>
                    <div className="galleryOutfits">
                        {savedOutfits.map((outfit, index) => (
                            <div key={outfit.id || index} className="outfit-card">
                                <h3>Аутфит {index + 1}</h3>
                                <div className="outfitHolder">
                                    <ClothesCard img={outfit.top.src} />
                                    <ClothesCard img={outfit.bottom.src} />
                                    <ClothesCard img={outfit.shoes.src} />
                                    <ButtonGen text="Удалить" func={() => deleteOutfit(index)} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="btn-container">
                        <ButtonGen text="Назад" func={() => navigate('/')} />
                    </div>
                </>
            )}
            <Footer />
        </div>
    );
}

export default GalleryApp;
