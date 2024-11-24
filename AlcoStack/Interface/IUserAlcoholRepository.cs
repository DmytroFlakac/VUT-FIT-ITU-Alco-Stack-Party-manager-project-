using AlcoStack.Models;
using AlcoStack.Enums;
using AlcoStack.Dtos;

namespace AlcoStack.Interface;

public interface IUserAlcoholRepository
{
    Task<UserAlcohol> AddAsync(string userName, Guid alcoholId);
    
    Task<ICollection<UserAlcohol>> AddAllAlcoholsAsync(string userName);
    Task<UserAlcohol?> DeleteAsync(string userName, Guid alcoholId);
    Task<ICollection<UpdateAlcoholRatingDto>> GetAlcoholRatingsByUserNameAsync(string userName);
    Task<UserAlcohol> UpdateVolumeAsync(string userName, string name, int volume);
   
    Task<UserAlcohol> UpdateRatingAsync(string userName, Guid alcoholId, int rating);

    Task<List<UserAlcohol>> UpdateAlcoholRatingsByTypeAsync(string userName, AlcoType type,
        List<UpdateAlcoholRatingDto> ratings);
    
    
    Task<ICollection<UserAlcohol>> GetAllAsync();
}