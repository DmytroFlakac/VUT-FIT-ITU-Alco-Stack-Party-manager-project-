using AlcoStack.Dtos;
using AlcoStack.Models;
using AlcoStack.Repositories;

namespace AlcoStack.Interface;

public interface IPartyUserAlcoholRepository
{
    Task<PartyUserAlcoholDto?> UpdateAmountAsync(string username, Guid partyId, PartyUserAlcoholDto userPartyAlcohol);
    Task<PartyUserAlcoholDto?> GetPartyAlcoholVolumeAsync(Guid partyId);

}