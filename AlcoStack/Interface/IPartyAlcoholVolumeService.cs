using AlcoStack.Dtos;
namespace AlcoStack.Interface;

public interface IPartyAlcoholVolumeService
{
    Task<PartyUserAlcoholDto> CalculateAndSavePartyAlcoholVolumesAsync(Guid partyId);
}