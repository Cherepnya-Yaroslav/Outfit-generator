import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/layout/Nav.jsx";
import ButtonGen from "../components/ui/ButtonGen.jsx";
import Footer from "../components/layout/Footer.jsx";
import ClothesCard from "../components/ui/ClothesCard.jsx";
import "../styles/App.css";

function App() {
    const navigate = useNavigate();
    
    // Инициализация состояний с загрузкой из localStorage
    const [topItems, setTopItems] = useState(() => {
        try {
            const saved = localStorage.getItem("topItems");
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Error loading topItems:", error);
            return [];
        }
    });

    const [botItems, setBotItems] = useState(() => {
        try {
            const saved = localStorage.getItem("botItems");
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Error loading botItems:", error);
            return [];
        }
    });

    const [shoesItems, setShoesItems] = useState(() => {
        try {
            const saved = localStorage.getItem("shoesItems");
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Error loading shoesItems:", error);
            return [];
        }
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const [outfit, setOutfit] = useState(null);
    const [isGenerated, setIsGenerated] = useState(false);

    const clearOldestItems = (category, items) => {
        if (items.length > 10) { // Ограничиваем количество items в каждой категории
            const newItems = items.slice(-10); // Оставляем только последние 10 элементов
            try {
                localStorage.setItem(category, JSON.stringify(newItems));
                return newItems;
            } catch (error) {
                console.error(`Error saving ${category}:`, error);
                return items;
            }
        }
        return items;
    };

    // Обновляем useEffect для topItems
    useEffect(() => {
        try {
            const newItems = clearOldestItems("topItems", topItems);
            if (newItems !== topItems) {
                setTopItems(newItems);
            } else {
                localStorage.setItem("topItems", JSON.stringify(topItems));
            }
        } catch (error) {
            console.error("Error saving topItems:", error);
        }
    }, [topItems]);

    // Обновляем useEffect для botItems
    useEffect(() => {
        try {
            const newItems = clearOldestItems("botItems", botItems);
            if (newItems !== botItems) {
                setBotItems(newItems);
            } else {
                localStorage.setItem("botItems", JSON.stringify(botItems));
            }
        } catch (error) {
            console.error("Error saving botItems:", error);
        }
    }, [botItems]);

    // Обновляем useEffect для shoesItems
    useEffect(() => {
        try {
            const newItems = clearOldestItems("shoesItems", shoesItems);
            if (newItems !== shoesItems) {
                setShoesItems(newItems);
            } else {
                localStorage.setItem("shoesItems", JSON.stringify(shoesItems));
            }
        } catch (error) {
            console.error("Error saving shoesItems:", error);
        }
    }, [shoesItems]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 150; // Уменьшаем максимальную ширину
                    const MAX_HEIGHT = 150; // Уменьшаем максимальную высоту
                    let width = img.width;
                    let height = img.height;

                    // Вычисляем новые размеры, сохраняя пропорции
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.round(height * MAX_WIDTH / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.round(width * MAX_HEIGHT / height);
                            height = MAX_HEIGHT;
                        }
                    }

                    // Создаем временный canvas для уменьшения размера
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCanvas.width = width;
                    tempCanvas.height = height;
                    
                    // Применяем пошаговое уменьшение для лучшего качества
                    let currentWidth = img.width;
                    let currentHeight = img.height;
                    
                    while (currentWidth > width * 2 || currentHeight > height * 2) {
                        currentWidth = Math.floor(currentWidth / 2);
                        currentHeight = Math.floor(currentHeight / 2);
                        tempCtx.drawImage(img, 0, 0, currentWidth, currentHeight);
                        img.src = tempCanvas.toDataURL('image/jpeg', 0.5);
                    }

                    // Финальное изображение
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Максимально сжимаем
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.3);
                    
                    // Проверяем размер и при необходимости сжимаем еще сильнее
                    if (compressedDataUrl.length > 50000) { // Если больше ~50KB
                        canvas.width = width / 2;
                        canvas.height = height / 2;
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, width / 2, height / 2);
                        ctx.drawImage(img, 0, 0, width / 2, height / 2);
                        resolve(canvas.toDataURL('image/jpeg', 0.2));
                    } else {
                        resolve(compressedDataUrl);
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!selectedCategory) {
            alert("Пожалуйста, выберите категорию перед загрузкой!");
            return;
        }

        try {
            const compressedImage = await compressImage(file);
            const newItem = { id: Date.now(), src: compressedImage };

            if (selectedCategory === "верх") {
                setTopItems(prevItems => [...prevItems, newItem]);
            } else if (selectedCategory === "низ") {
                setBotItems(prevItems => [...prevItems, newItem]);
            } else if (selectedCategory === "обувь") {
                setShoesItems(prevItems => [...prevItems, newItem]);
            }
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Произошла ошибка при обработке изображения");
        }
    };

    const resetImages = () => {
        setTopItems([]);
        setBotItems([]);
        setShoesItems([]);
        try {
            localStorage.removeItem("topItems");
            localStorage.removeItem("botItems");
            localStorage.removeItem("shoesItems");
        } catch (error) {
            console.error("Error resetting items:", error);
        }
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

    const compressOutfitImages = (outfit) => {
        const compressBase64 = (base64Str) => {
            const canvas = document.createElement('canvas');
            const img = new Image();
            return new Promise((resolve) => {
                img.onload = () => {
                    canvas.width = 100;  // Максимально уменьшаем размер
                    canvas.height = 100;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, 100, 100);
                    ctx.drawImage(img, 0, 0, 100, 100);
                    resolve(canvas.toDataURL('image/jpeg', 0.2));
                };
                img.src = base64Str;
            });
        };

        return new Promise(async (resolve) => {
            const compressedTop = await compressBase64(outfit.top.src);
            const compressedBottom = await compressBase64(outfit.bottom.src);
            const compressedShoes = await compressBase64(outfit.shoes.src);

            resolve({
                id: outfit.id,
                top: {
                    id: outfit.top.id,
                    src: compressedTop
                },
                bottom: {
                    id: outfit.bottom.id,
                    src: compressedBottom
                },
                shoes: {
                    id: outfit.shoes.id,
                    src: compressedShoes
                }
            });
        });
    };

    const saveOutfit = async () => {
        if (!outfit) return;
        
        try {
            // Получаем текущие сохраненные аутфиты
            const savedOutfits = localStorage.getItem("outfits");
            let currentOutfits = savedOutfits ? JSON.parse(savedOutfits) : [];
            
            // Ограничиваем количество сохраненных аутфитов до 5
            if (currentOutfits.length >= 5) {
                currentOutfits = currentOutfits.slice(-4); // Оставляем последние 4 аутфита
            }
            
            // Создаем новый аутфит с уникальным ID и сжатыми изображениями
            const newOutfit = await compressOutfitImages({
                id: Date.now(),
                ...outfit
            });
            
            // Добавляем новый аутфит к существующим
            const updatedOutfits = [...currentOutfits, newOutfit];
            
            // Сохраняем обновленный массив
            localStorage.setItem("outfits", JSON.stringify(updatedOutfits));
            
            alert("Аутфит сохранен в галерею!");
            navigate('/gallery');
        } catch (error) {
            console.error("Error saving outfit:", error);
            alert("Произошла ошибка при сохранении аутфита. Возможно, некоторые изображения слишком большие.");
        }
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
