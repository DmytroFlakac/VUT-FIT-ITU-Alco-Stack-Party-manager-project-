namespace AlcoStack.Models;

public class UserAlcohol
{
    public string UserName { get; set; }
    public User User { get; set; }
    
    public Guid AlcoholId { get; set; }
    public Alcohol Alcohol { get; set; }
    
    public int Rating { get; set; } = 0;
    
    
}   