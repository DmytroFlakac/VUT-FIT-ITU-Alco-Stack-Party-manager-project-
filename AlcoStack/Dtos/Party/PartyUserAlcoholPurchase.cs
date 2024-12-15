namespace AlcoStack.Dtos;

    public class PartyUserAlcoholPurchaseDto
    {
        public List<AlcoholPurchaseDto> AlcoholPurchases { get; set; }
    }

    public class AlcoholPurchaseDto
    {
        public string Name { get; set; } // Alcohol name
        public bool WillBeBought { get; set; } // Whether the alcohol will be bought by the user
    }
