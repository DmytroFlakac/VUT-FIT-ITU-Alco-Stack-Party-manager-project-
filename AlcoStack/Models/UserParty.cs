namespace AlcoStack.Models;

public class UserParty
{
    public string UserName { get; set; }
    public User User { get; set; }
    
    public Guid PartyId { get; set; }
    public Party Party { get; set; }

}