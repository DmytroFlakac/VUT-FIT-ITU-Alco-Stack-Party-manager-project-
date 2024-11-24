namespace AlcoStack.Models
{
    public class Cocktail
    {
        public string IdDrink { get; set; } // ID коктейля
        public string StrDrink { get; set; } // Название коктейля
        public string StrDrinkThumb { get; set; } // Ссылка на миниатюру коктейля
        //public string StrInstructions { get; set; } // Инструкция приготовления
        //public string StrGlass { get; set; } // Тип стакана для подачи
        //public List<CocktailIngredient> Ingredients { get; set; } // Список ингредиентов
    }

    //public class CocktailIngredient
    //{
       // public string Name { get; set; } // Название ингредиента
        //public string Photo { get; set; } // Фото ингредиента
    //}

    public class CocktailList
    {
        public List<Cocktail> Drinks { get; set; } // Список коктейлей
    }
}