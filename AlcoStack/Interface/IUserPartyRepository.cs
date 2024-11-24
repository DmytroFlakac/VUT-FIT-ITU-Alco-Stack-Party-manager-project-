using AlcoStack.Models;

namespace AlcoStack.Interface;

public interface IUserPartyRepository
{
    Task<UserParty> AddAsync(string userName, Guid partyId);
    Task<UserParty?> DeleteAsync(string userName, Guid partyId);
    Task<ICollection<Party>?> GetByUserNameAsync(string userName);
    Task<ICollection<Party>?> GetHistoryByUserNameAsync(string userName);
    Task<ICollection<User>?> GetUsersByPartyIdAsync(Guid partyId);

    
    Task<ICollection<UserParty>> GetAllAsync();
}