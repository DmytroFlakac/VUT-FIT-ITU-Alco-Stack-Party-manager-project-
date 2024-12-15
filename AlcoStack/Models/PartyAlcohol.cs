namespace AlcoStack.Models;

public class PartyAlcohol
{
    public Guid PartyId { get; set; }

    public Party Party { get; set; }
    
    public Guid AlcoholId { get; set; }
    
    public Alcohol Alcohol { get; set; }
    
    public double Volume { get; set; } = 0.0;
    
    public int Rank { get; set; } = 0;
    
    public bool? WillBeBought { get; set; } = false;
}