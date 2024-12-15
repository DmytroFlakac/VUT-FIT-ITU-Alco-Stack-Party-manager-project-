using AlcoStack.Models;
using AlcoStack.Enums;

namespace AlcoStack.Dtos;

public class PartyDto
{
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    public string? Photo { get; set; }
    
    public DateTime date { get; set; }
    
    public DateTime preparationDate { get; set; }
    public string? Location { get; set; }
    
    public bool Liquors { get; set; } = false;
    
    public bool  LowAlcohol { get; set; } = false;
    
    public bool  MidAlcohol { get; set; } = false;
    
    public bool  HighAlcohol { get; set; } = false;
    
    public int RankLimit { get; set; } = 0;
    
    
    
    public bool CreatedByMe { get; set; }
    
    
    
}