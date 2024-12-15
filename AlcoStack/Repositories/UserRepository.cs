using AlcoStack.Data;
using AlcoStack.Dtos;
using AlcoStack.Interface;
using AlcoStack.Models;
using AlcoStack.Mappers;
using Microsoft.EntityFrameworkCore;

namespace AlcoStack.Repositories;

public class UserRepository(AppDataContext context) : IUserRepository
{
    public async Task<User> UpdateAsync(string userName, UpdateUserDto user)
    {
        var existingUser = await context.Users.Include(x => x.Address).FirstOrDefaultAsync(user => user.UserName == userName);
        if (existingUser == null)
        {
            throw new Exception("User not found");
        }
        
        existingUser.UpdatedDate = DateTime.Now;
        existingUser.CreatedDate = existingUser.CreatedDate;
        existingUser.FirstName = user.FirstName;
        existingUser.LastName = user.LastName;
        existingUser.Bio = user.Bio;
        existingUser.DateOfBirth = user.DateOfBirth;
        existingUser.PhoneNumber = user.PhoneNumber;
        if (user.Address != null)
        {
            existingUser.Address.StreetAddress = user.Address.StreetAddress;
            existingUser.Address.City = user.Address.City;
            existingUser.Address.PostalCode = user.Address.PostalCode;
            
        }
        context.Users.Update(existingUser);
        await context.SaveChangesAsync();
        return existingUser;
    }
    
    public async Task<User?> GetAsync(string userName)
    {
        var user = await context.Users.FirstOrDefaultAsync(user => user.UserName == userName);
        if (user == null)
        {
            throw new Exception("User not found");
        }
        return user;
    }
    
    public async Task<List<User>> GetAllAsync()
    {
        return await context.Users.ToListAsync();
    }
    
    public async Task<User?> DeleteAsync(string userName)
{
    // Fetch the user
    var user = await context.Users
        .Include(u => u.CreatedParties) // Include parties created by the user
        .Include(u => u.Parties) // Include parties the user is a participant in
        .ThenInclude(up => up.Party)
        .FirstOrDefaultAsync(user => user.UserName == userName);

    if (user == null)
    {
        throw new Exception("User not found");
    }

    // Handle parties created by the user
    foreach (var createdParty in user.CreatedParties)
    {
        // Remove all PartyUserAlcohol entries related to the party
        var partyUserAlcohols = await context.PartyUserAlcohols
            .Where(pua => pua.PartyId == createdParty.Id)
            .ToListAsync();

        context.PartyUserAlcohols.RemoveRange(partyUserAlcohols);

        // Remove the party itself
        context.Parties.Remove(createdParty);
    }

    // Handle parties the user is a participant in
    foreach (var userParty in user.Parties)
    {
        var partyId = userParty.PartyId;

        // Adjust volumes in PartyAlcohols
        var userAlcohols = await context.PartyUserAlcohols
            .Where(pua => pua.UserName == user.Id && pua.PartyId == partyId)
            .ToListAsync();

        foreach (var userAlcohol in userAlcohols)
        {
            var partyAlcohol = await context.PartyAlcohols
                .FirstOrDefaultAsync(pa => pa.PartyId == partyId && pa.AlcoholId == userAlcohol.AlcoholId);

            if (partyAlcohol != null)
            {
                // Subtract the user's volume from the party's volume
                partyAlcohol.Volume -= userAlcohol.Volume;

                // Ensure the volume doesn't go below zero
                if (partyAlcohol.Volume < 0)
                {
                    partyAlcohol.Volume = 0;
                }
            }
        }

        // Remove PartyUserAlcohol entries for this user
        context.PartyUserAlcohols.RemoveRange(userAlcohols);

        // Remove the UserParty entry
        context.UserParties.Remove(userParty);
    }

   

    // Save changes to the database
    await context.SaveChangesAsync();

    return user;
}

}