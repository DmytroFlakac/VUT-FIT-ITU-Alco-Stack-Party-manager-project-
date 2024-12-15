namespace AlcoStack.Dtos;

public class PartyListDto
{
    public Guid PartyId { get; set; }
    
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    public DateTime date { get; set; }
    
    public bool CreatedByMe { get; set; }
}