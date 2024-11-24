using AlcoStack.Dtos;
using AlcoStack.Models;

namespace AlcoStack.Mappers;

public static class AlcoholMapper
{
    public static AlcoholDto  MapToDto(this Alcohol alcohol) => new AlcoholDto
    {
        Name = alcohol.Name, 
        Type = alcohol.Type,
        Photo = alcohol.Photo,
        Description = alcohol.Description,
    };

    public static Alcohol MapToModel(this AlcoholDto alcoholDto) => new Alcohol
    {
        Name = alcoholDto.Name,
        Type = alcoholDto.Type,
        Photo = alcoholDto.Photo,
        Description = alcoholDto.Description,
    };
    
    public static Alcohol MapToModel(this CreateAlcoholDto createAlcoholDto) => new Alcohol
    {
        Name = createAlcoholDto.Name,
        Type = createAlcoholDto.Type,
        Photo = createAlcoholDto.Photo,
        Description = createAlcoholDto.Description,
    };
}