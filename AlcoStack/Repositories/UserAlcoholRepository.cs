using AlcoStack.Models;
using AlcoStack.Interface;
using AlcoStack.Dtos;
using AlcoStack.Data;
using AlcoStack.Enums;
using Microsoft.EntityFrameworkCore;


namespace AlcoStack.Repositories;

public class UserAlcoholRepository(AppDataContext context) : IUserAlcoholRepository
{
    public async Task<UserAlcohol> AddAsync(string userName, Guid alcoholId)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == userName);
        
        if (user == null)
        {
            throw new Exception("User not found");
        }
        
        var alcohol = await context.Alcohols.FirstOrDefaultAsync(x => x.Id == alcoholId);
        
        if (alcohol == null)
        {
            throw new Exception("Alcohol not found");
        }
        
        var userAlcohol = new UserAlcohol
        {
            UserName = userName,
            AlcoholId = alcoholId,
            User = user,
            Alcohol = alcohol
        };
        
        await context.UserAlcohols.AddAsync(userAlcohol);
        await context.SaveChangesAsync();
        return userAlcohol;
    }

    public async Task<ICollection<UserAlcohol>> AddAllAlcoholsAsync(string userName)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == userName);
        
        if (user == null)
        {
            throw new Exception("User not found");
        }
        
        var alcohols = await context.Alcohols.ToListAsync();
        
        var userAlcohols = alcohols.Select(x => new UserAlcohol
        {
            UserName = userName,
            AlcoholId = x.Id,
            User = user,
            Alcohol = x
        }).ToList();
        
        await context.UserAlcohols.AddRangeAsync(userAlcohols);
        await context.SaveChangesAsync();
        return userAlcohols;
    }

    public async Task<UserAlcohol?> DeleteAsync(string userName, Guid alcoholId)
    {
        var userAlcohol = await context.UserAlcohols
            .FirstOrDefaultAsync(x => x.UserName == userName && x.AlcoholId == alcoholId);
        
        if (userAlcohol == null)
        {
            throw new Exception("UserAlcohol not found");
        }
        
        context.UserAlcohols.Remove(userAlcohol);
        await context.SaveChangesAsync();
        return userAlcohol;
    }

    public async Task<ICollection<UpdateAlcoholRatingDto>> GetAlcoholRatingsByUserNameAsync(string userName)
    {
        var ratingsWithIds = await context.UserAlcohols
            .Where(x => x.UserName == userName)
            .Select(x => new UpdateAlcoholRatingDto
            {
                AlcoholId = x.AlcoholId,
                Rating = x.Rating
            }) // Map to DTO
            .ToListAsync();

        return ratingsWithIds;
    }




    public async Task<UserAlcohol> UpdateVolumeAsync(string userName, string name, int volume)
    {
        var userAlcohol = await context.UserAlcohols
            .FirstOrDefaultAsync(x => x.UserName == userName && x.Alcohol.Name == name);
        
        if (userAlcohol == null)
        {
            throw new Exception("UserAlcohol not found");
        }
        
        //userAlcohol.Volume = volume;
        
        context.UserAlcohols.Update(userAlcohol);
        await context.SaveChangesAsync();
        
        return userAlcohol;
    }

   
   public async Task<UserAlcohol> UpdateRatingAsync(string userName, Guid alcoholId, int rating)
   {
       var userAlcohol = await context.UserAlcohols
           .FirstOrDefaultAsync(x => x.UserName == userName && x.AlcoholId == alcoholId);
        
       if (userAlcohol == null)
       {
           throw new Exception("UserAlcohol not found");
       }
        
       userAlcohol.Rating = rating;
       context.UserAlcohols.Update(userAlcohol);
       await context.SaveChangesAsync();
       return userAlcohol;
   }
   public async Task<List<UserAlcohol>> UpdateAlcoholRatingsByTypeAsync(string userName, AlcoType type, List<UpdateAlcoholRatingDto> ratings)
   {
       var userAlcohols = await context.UserAlcohols
           .Where(ua => ua.UserName == userName && ua.Alcohol.Type == type)
           .ToListAsync();

       foreach (var ratingDto in ratings)
       {
           var userAlcohol = userAlcohols.FirstOrDefault(ua => ua.AlcoholId == ratingDto.AlcoholId);
           if (userAlcohol != null)
           {
               userAlcohol.Rating = ratingDto.Rating;
           }
       }

       // Збереження змін у базі даних
       await context.SaveChangesAsync();

       // Повернення оновленого списку UserAlcohol
       return userAlcohols;
   }


    public async Task<ICollection<UserAlcohol>> GetAllAsync()
    {
        var userAlcohols = await context.UserAlcohols
            .Include(x => x.Alcohol)
            .ToListAsync();
        return userAlcohols;
    }
}