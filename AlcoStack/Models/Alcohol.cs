using AlcoStack.Enums;

namespace AlcoStack.Models;

public class Alcohol
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    public AlcoType Type { get; set; }
    
    public string Photo { get; set; }
    
    public string Description { get; set; }
    
    
    public ICollection<PartyAlcohol> Parties { get; set; } = new List<PartyAlcohol>();
    
    public ICollection<UserAlcohol> Users { get; set; } = new List<UserAlcohol>();
    
    public ICollection<PartyUserAlcohol> PartyUserAlcohols { get; set; } = new List<PartyUserAlcohol>();

}