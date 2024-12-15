using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using AlcoStack.Data;
using AlcoStack.Models;
using AlcoStack.Enums; // Ensure this namespace contains AlcoType

namespace AlcoStack
{
    public class Seed
    {
        private readonly AppDataContext context;

        public Seed(AppDataContext context)
        {
            this.context = context;
        }

        public void SeedData()
        {
            // Ensure the database is created
            context.Database.EnsureCreated();

            // Check if there is already data in the Alcohol table
            if (!context.Alcohols.Any())
            {
                var alcohols = new List<Alcohol>
                {
                    new Alcohol
                    {
                        Id = new Guid("4cb3947a-8395-4e18-b777-9053e452035a"),
                        Name = "Light rum",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/light_rum.jpg",
                        Description = "A type of rum with a lighter flavor profile."
                    },
                    new Alcohol
                    {
                        Id = new Guid("ec7f6294-79a3-4122-8d00-097748b588a2"),
                        Name = "Bourbon",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/bourbon.jpg",
                        Description = "A type of American whiskey made primarily from corn."
                    },
                    new Alcohol
                    {
                        Id = new Guid("abf08396-a626-4dc1-834c-80153f66bcdb"),
                        Name = "Vodka",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/vodka.jpg",
                        Description = "A distilled alcoholic drink made from fermented grains or potatoes."
                    },
                    new Alcohol
                    {
                        Id = new Guid("d6f0f193-e3fd-4136-b3f2-1613f2e24f84"),
                        Name = "Gin",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/gin.jpg",
                        Description = "A distilled alcoholic drink flavored with juniper berries."
                    },
                    new Alcohol
                    {
                        Id = new Guid("e8310620-73fb-4496-9cfb-32f554e737e3"),
                        Name = "Blended whiskey",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/blended_whiskey.jpg",
                        Description = "A type of whiskey made by blending different whiskey types."
                    },
                    new Alcohol
                    {
                        Id = new Guid("dced866c-0c83-4d72-8b2f-f944bcdb93e8"),
                        Name = "Tequila",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/tequila.jpg",
                        Description = "A Mexican spirit made from the blue agave plant."
                    },
                    new Alcohol
                    {
                        Id = new Guid("45505103-792d-44b1-a3fd-595016820885"),
                        Name = "Sweet Vermouth",
                        Type = AlcoType.MidlAlcohol,
                        Photo = "https://example.com/photos/sweet_vermouth.jpg",
                        Description = "A fortified wine flavored with various botanicals."
                    },
                    new Alcohol
                    {
                        Id = new Guid("302002bb-75cf-4f3e-bcfa-879094873128"),
                        Name = "Apricot brandy",
                        Type = AlcoType.Liquor,
                        Photo = "https://example.com/photos/apricot_brandy.jpg",
                        Description = "A type of brandy flavored with apricot."
                    },
                    new Alcohol
                    {
                        Id = new Guid("775ca315-06ed-46c3-8c25-8eb11c06eb43"),
                        Name = "Triple sec",
                        Type = AlcoType.Liquor,
                        Photo = "https://example.com/photos/triple_sec.jpg",
                        Description = "A type of orange-flavored liqueur."
                    },
                    new Alcohol
                    {
                        Id = new Guid("689dfe25-f0e2-4b04-824f-966dd77cb85f"),
                        Name = "Southern Comfort",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/southern_comfort.jpg",
                        Description = "A fruit-flavored liqueur with a whiskey base."
                    },
                    new Alcohol
                    {
                        Id = new Guid("8664ee76-6e53-4c4d-b7c2-7934c1ef31b8"),
                        Name = "Brandy",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/brandy.jpg",
                        Description = "A distilled alcoholic drink made from fermented fruit juice."
                    },
                    new Alcohol
                    {
                        Id = new Guid("9ff6743e-bcff-48fc-88c7-82bc33163b17"),
                        Name = "Lemon vodka",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/lemon_vodka.jpg",
                        Description = "Vodka flavored with lemon."
                    },
                    new Alcohol
                    {
                        Id = new Guid("6841e096-c169-4d51-96ed-382937403d80"),
                        Name = "Dry Vermouth",
                        Type = AlcoType.MidlAlcohol,
                        Photo = "https://example.com/photos/dry_vermouth.jpg",
                        Description = "A type of fortified wine with a dry flavor."
                    },
                    new Alcohol
                    {
                        Id = new Guid("bb9b2884-9380-4b6c-b324-f8865e703532"),
                        Name = "Dark rum",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/dark_rum.jpg",
                        Description = "A type of rum with a dark color and rich flavor."
                    },
                    new Alcohol
                    {
                        Id = new Guid("9bc1c58a-6065-4525-9a9b-03faeca93557"),
                        Name = "Amaretto",
                        Type = AlcoType.Liquor,
                        Photo = "https://example.com/photos/amaretto.jpg",
                        Description = "An almond-flavored liqueur."
                    },
                    new Alcohol
                    {
                        Id = new Guid("bbc9c593-d7ae-4646-bc7a-0596810b932f"),
                        Name = "Applejack",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/applejack.jpg",
                        Description = "A type of American apple brandy."
                    },
                    new Alcohol
                    {
                        Id = new Guid("3a7737b9-9b9a-49b2-a247-7bdab2cc203e"),
                        Name = "Champagne",
                        Type = AlcoType.MidlAlcohol,
                        Photo = "https://example.com/photos/champagne.jpg",
                        Description = "A sparkling wine produced in the Champagne region of France."
                    },
                    new Alcohol
                    {
                        Id = new Guid("8c3f326d-64b3-4d94-8d17-a0aea279de69"),
                        Name = "Scotch",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/scotch.jpg",
                        Description = "A type of whisky made in Scotland."
                    },
                    new Alcohol
                    {
                        Id = new Guid("80575096-0f64-4ef4-8e1c-bb73eecb2cab"),
                        Name = "Coffee liqueur",
                        Type = AlcoType.Liquor,
                        Photo = "https://example.com/photos/coffee_liqueur.jpg",
                        Description = "A liqueur flavored with coffee."
                    },
                    new Alcohol
                    {
                        Id = new Guid("eec85749-6c16-42ee-a5bd-5a81e7630609"),
                        Name = "Añejo rum",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/anejo_rum.jpg",
                        Description = "A type of aged rum."
                    },
                    new Alcohol
                    {
                        Id = new Guid("c5c71908-0a99-4e14-9b46-0008919c14e5"),
                        Name = "Kahlua",
                        Type = AlcoType.Liquor,
                        Photo = "https://example.com/photos/kahlua.jpg",
                        Description = "A coffee-flavored liqueur."
                    },
                    new Alcohol
                    {
                        Id = new Guid("3a12ed91-e016-48a9-9c89-adf99c83e6e9"),
                        Name = "Dubonnet Rouge",
                        Type = AlcoType.MidlAlcohol,
                        Photo = "https://example.com/photos/dubonnet_rouge.jpg",
                        Description = "A type of fortified wine with a rich flavor."
                    },
                    new Alcohol
                    {
                        Id = new Guid("11d02786-4530-46ef-a68a-be6db24b290d"),
                        Name = "Irish whiskey",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/irish_whiskey.jpg",
                        Description = "A smooth whiskey made in Ireland."
                    },
                    new Alcohol
                    {
                        Id = new Guid("1f3f3072-94cb-4164-968e-af39f8f3f502"),
                        Name = "Apple brandy",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/apple_brandy.jpg",
                        Description = "A type of brandy made from apples."
                    },
                    new Alcohol
                    {
                        Id = new Guid("da66009b-09ae-4fc6-a9f9-471b5fb8fda7"),
                        Name = "Prosecco",
                        Type = AlcoType.MidlAlcohol,
                        Photo = "https://example.com/photos/prosecco.jpg",
                        Description = "An Italian sparkling wine."
                    },
                    new Alcohol
                    {
                        Id = new Guid("eb010028-3630-4ee6-99e7-cbd5bbff8ec2"),
                        Name = "Cognac",
                        Type = AlcoType.HighAlcohol,
                        Photo = "https://example.com/photos/cognac.jpg",
                        Description = "A type of brandy from the Cognac region in France."
                    },
                    new Alcohol
                    {
                        Id = new Guid("a745bc6e-14d2-45f5-a0b4-9ee8b7936754"),
                        Name = "Beer",
                        Type = AlcoType.LowAlcohol,
                        Photo = "https://example.com/photos/beer.jpg",
                        Description = ""
                    },
                    new Alcohol
                    {
                        Id = new Guid("0dec2807-98c9-4d48-a698-81ca5c3fd04c"),
                        Name = "Cider",
                        Type = AlcoType.LowAlcohol,
                        Photo = "https://example.com/photos/cider.jpg",
                        Description = "A refreshing low-alcohol drink made from fermented apple juice."
                    },
                    new Alcohol
                    {
                        Id = new Guid("dccfaddc-7907-42a4-85a1-ed392926beaa"),
                        Name = "Lager Beer",
                        Type = AlcoType.LowAlcohol,
                        Photo = "https://example.com/photos/lager.jpg",
                        Description = "A type of beer fermented and conditioned at low temperatures."
                    },
                    new Alcohol
                    {
                        Id = new Guid("be695724-d48f-4131-b9df-9d2bbb028796"),
                        Name = "Ale",
                        Type = AlcoType.LowAlcohol,
                        Photo = "https://example.com/photos/ale.jpg",
                        Description = "A top-fermented beer with a rich and complex flavor."
                    },
                    new Alcohol
                    {
                        Id = new Guid("94544897-cd6a-45b4-9bbc-1eaf7929fac9"),
                        Name = "Dark Beer",
                        Type = AlcoType.LowAlcohol,
                        Photo = "https://example.com/photos/dark_beer.jpg",
                        Description = "A strong and flavorful beer with roasted malt tones."
                    }
                };

                context.Alcohols.AddRange(alcohols);
                context.SaveChanges();
            }
        }
    }
}
