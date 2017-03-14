
using System.Linq;
using System.Text;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AspNet.Identity.MongoDB;
using MongoDB.Driver;
using System.Data.Entity.Infrastructure.Interception;
using AspNetIdentityMongoWebAPI.API.Context;
using AspNetIdentityMongoWebAPI.API.Entities;
using AspNetIdentityMongoWebAPI.API.Models;
//using Microsoft.AspNet.Identity.EntityFramework;

namespace AspNetIdentityMongoWebAPI.API.App_Start
{
    public class ApplicationIdentityContext : IDisposable
    {
        //private MongoClient client;
        //private IMongoDatabase database;
       
        public static ApplicationIdentityContext Create()
        {
            // todo add settings where appropriate to switch server & database in your own application
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("DamorelDB");
            var users = database.GetCollection<ApplicationUser>("users");
            var roles = database.GetCollection<ApplicationRole>("roles");
            var ubase = database.GetCollection<UserBase>("UserBase");
            var clients = database.GetCollection<Client>("CLient");
            var refToken = database.GetCollection<RefreshToken>("RefreshToken");
            return new ApplicationIdentityContext(users, roles,ubase);
        }

        //public ApplicationIdentityContext()
        //{
        //    client = new MongoClient("mongodb://localhost:27017");
        //}

        public ApplicationIdentityContext(IMongoCollection<ApplicationUser> users, IMongoCollection<ApplicationRole> roles,IMongoCollection <UserBase > ubase)
        {
            //DbInterception.Add(new FtsInterceptor());
            Users = users;
            Roles = roles;
            UserBase = ubase;
        }

       

        public IMongoCollection<ApplicationRole> Roles { get; set; }

        public IMongoCollection<ApplicationUser> Users { get; set; }

        public Task<List<ApplicationRole>> AllRolesAsync()
        {
            return Roles.Find(r => true).ToListAsync();
        }

        public IMongoCollection<Client> Clients { get; set; }
        public IMongoCollection<RefreshToken> RefreshTokens { get; set; }

        public IMongoCollection<UserBase> UserBase { get; set; }
        public List <UserBase> AllUserBase()
        {
            return UserBase.Find(r => true).ToList();//.Select(u => u.Organization);
        }

        public IMongoCollection<Datasets> Datasets { get; set; }

        //public IMongoCollection<Category> Category { get; set; }

        public IMongoCollection<UpgradeRequest> UpgradeRequest { get; set; }

        public IMongoCollection<Transactions> Transactions { get; set; }

        public void Dispose()
        {
        }
    }
}
