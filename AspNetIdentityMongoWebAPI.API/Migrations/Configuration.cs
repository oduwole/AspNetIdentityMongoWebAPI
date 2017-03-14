namespace Deitalyst.API.Migrations
{
    using Deitalyst.API.Entities;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using Deitalyst.API.Models;
    using Deitalyst.API.Context;
    using Deitalyst.API.Repository;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Microsoft.AspNet.Identity;

    internal sealed class Configuration : DbMigrationsConfiguration<AuthContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(AuthContext context)
        {
            if (context.Clients.Count() > 0)
            {
                return;
            }

            context.Clients.AddRange(BuildClientsList());
            BuildRoles(context);
            context.SaveChanges();
            
        }

        private static List<Client> BuildClientsList()
        {

            List<Client> ClientsList = new List<Client> 
            {
                new Client
                { Id = "deitalyst.org", 
                    Secret= Helper.GetHash("abc@123"), 
                    Name="Deiatlyst.org ", 
                    ApplicationType =  Models.ApplicationTypes.JavaScript, 
                    Active = true, 
                    RefreshTokenLifeTime = 14400, 
                    AllowedOrigin = "http://deitalyst.org"
                },
                new Client
                { Id = "deitalyst.com", 
                    Secret= Helper.GetHash("abc@123"), 
                    Name="Deiatlyst.com ", 
                    ApplicationType =  Models.ApplicationTypes.JavaScript, 
                    Active = true, 
                    RefreshTokenLifeTime = 14400, 
                    AllowedOrigin = "http://deitalyst.com"
                },
                new Client
                { Id = "ngAuthApp", 
                    Secret= Helper.GetHash("abc@123"), 
                    Name="Deiatlyst.com ", 
                    ApplicationType =  Models.ApplicationTypes.JavaScript, 
                    Active = true, 
                    RefreshTokenLifeTime = 7200, 
                    AllowedOrigin = "http://nuthenticationweb.azurewebsites.net"
                },
                new Client
                { Id = "consoleApp", 
                    Secret=Helper.GetHash("123@abc"), 
                    Name="Console Application", 
                    ApplicationType =Models.ApplicationTypes.NativeConfidential, 
                    Active = true, 
                    RefreshTokenLifeTime = 14400, 
                    AllowedOrigin = "*"
                }
            };

            return ClientsList;
        }

        private static void BuildRoles(AuthContext context)
        {
            if (!context.Roles.Any(r => r.Name == "Administrator"))
            {
                var store = new RoleStore<ApplicationRole>(context);
                var manager = new RoleManager<ApplicationRole>(store);
                var role = new ApplicationRole
                {
                    Name = "Administrator",
                    Description = "Administrator Role"
                };

                manager.Create(role);
            }
            if (!context.Roles.Any(r => r.Name == "Root"))
            {
                var store = new RoleStore<ApplicationRole>(context);
                var manager = new RoleManager<ApplicationRole>(store);
                var role = new ApplicationRole
                {
                    Name = "Root",
                    Description = "Root Administrator Role"
                };

                manager.Create(role);
            }
            if (!context.Roles.Any(r => r.Name == "Vendors"))
            {
                var store = new RoleStore<ApplicationRole>(context);
                var manager = new RoleManager<ApplicationRole>(store);
                var role = new ApplicationRole
                {
                    Name = "Vendors",
                    Description = "Vendors Role"
                };

                manager.Create(role);
            }
            if (!context.Roles.Any(r => r.Name == "Shopper"))
            {
                var store = new RoleStore<ApplicationRole>(context);
                var manager = new RoleManager<ApplicationRole>(store);
                var role = new ApplicationRole
                {
                    Name = "Shopper",
                    Description = "Shop Manager Role"
                };

                manager.Create(role);
            }
            if (!context.Roles.Any(r => r.Name == "Merchant"))
            {
                var store = new RoleStore<ApplicationRole>(context);
                var manager = new RoleManager<ApplicationRole>(store);
                var role = new ApplicationRole
                {
                    Name = "Merchant",
                    Description = "Merchant Role"
                };

                manager.Create(role);
            }
            
            
        }
    }
}
