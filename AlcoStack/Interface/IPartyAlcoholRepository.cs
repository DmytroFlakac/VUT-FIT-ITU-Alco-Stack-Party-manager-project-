using AlcoStack.Models;
using AlcoStack.Dtos;

namespace AlcoStack.Interface;

public interface IPartyAlcoholRepository
{
    
    Task<PartyAlcohol> AddAsync(Guid partyId, Guid alcoholId);
    Task<PartyAlcohol?> DeleteAsync(Guid partyId, Guid alcoholId);
    Task<ICollection<Alcohol>> GetAlcoholsByPartyIdAsync(Guid partyId);
    Task<ICollection<Alcohol>?> GetByRankAsync(Guid partyId);
    Task<ICollection<Alcohol>?> GetByRankAndLimitAsync(Guid partyId, int rankLimit);
    Task<ICollection<PartyAlcohol>> UpdateVolumeAsync(Guid partyId, Guid alcoholId, int volume);
    Task<ICollection<PartyAlcohol>> UpdateRankAsync(Guid partyId, Guid alcoholId, int rank);
    Task<ICollection<PartyAlcohol>> AddLiqoursAsync(Guid partyId);
    Task<ICollection<PartyAlcohol>> AddLowAlcoholsAsync(Guid partyId);
    Task<ICollection<PartyAlcohol>> AddMidAlcoholsAsync(Guid partyId);
    Task<ICollection<PartyAlcohol>> AddHighAlcoholsAsync(Guid partyId);
    Task<ICollection<PartyAlcohol>> DeleteLiqoursAsync(Guid partyId);
    Task<ICollection<PartyAlcohol>> DeleteLowAlcoholsAsync(Guid partyId);
    Task<ICollection<PartyAlcohol>> DeleteMidAlcoholsAsync(Guid partyId);
    Task<ICollection<PartyAlcohol>> DeleteHighAlcoholsAsync(Guid partyId);

    Task<PartyUserAlcoholPurchaseDto>
        UpdateAlcoholPurchasesAsync(Guid partyId, PartyUserAlcoholPurchaseDto purchaseDto);
    Task<ICollection<PartyAlcohol>> GetAllAsync();
    Task<PartyUserAlcoholDto> GetPartyUserAlcoholsWithVolumeAsync(Guid partyId);
    Task<bool> AnyAsync(Guid partyId);
}