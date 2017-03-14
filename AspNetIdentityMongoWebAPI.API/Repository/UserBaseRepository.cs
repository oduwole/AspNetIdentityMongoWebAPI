using AspNetIdentityMongoWebAPI.API.Context;
using AspNetIdentityMongoWebAPI.API.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AspNetIdentityMongoWebAPI.API.Repository
{
    
    class UserBaseRepository:ISettings
    {
        private readonly Settings _settings;
        private readonly IMongoDatabase _database;

        public string Database
        {
            get
            {
                return "DamorelDB";
            }

            set
            {
                throw new NotImplementedException();
            }
        }

        public string MongoConnection
        {
            get
            {
               return "mongodb://localhost:27017";
            }

            set
            {
                throw new NotImplementedException();
            }
        }

        //public UserBaseRepository(ISettings settings)
        public UserBaseRepository()
        {
            //_settings = settings ;
            _database = Connect();
        }

        private IMongoDatabase Connect()
        {
            var client = new MongoClient(MongoConnection);
            var server = client.GetServer();
            //var database = server.GetDatabase(Database);
            var database = client.GetDatabase(Database);

            return database;
        }

        public async  void Add(UserBase userBase)
        {
           await _database.GetCollection<UserBase>("UserBase").InsertOneAsync(userBase);
            //_database.GetCollection<UserBase>("speakers").Save(userBase);
        }

        public Task<List<UserBase>> AllSpeakers()
        {
            var ubase = _database.GetCollection<UserBase>("UserBase").Find(_ => true).ToListAsync(); ;
            return ubase;
        }

        public async Task<UserBase> GetById(ObjectId id)
        {
            //var query = Query<UserBase>.EQ(e => e.Id, id);
            //var speaker = _database.GetCollection<UserBase>("speakers").FindOneAsync(query);
            FindOptions<UserBase> options = new FindOptions<UserBase> { Limit = 1 };
            IAsyncCursor<UserBase> task = await _database .GetCollection <UserBase>("UserBase").FindAsync(x => x.Id.Equals(id), options);
            List<UserBase> list = await task.ToListAsync();
            UserBase ubase = list.FirstOrDefault();

            return ubase;
        }

        public bool Remove(ObjectId id)
        {
            //var query = Query<UserBase>.EQ(e => e.Id, id);
            //var result = _database.GetCollection<UserBase>("speakers").Remove(query);
            var result = _database.GetCollection<UserBase>("UserBase").DeleteOneAsync(x=>x.Id.Equals (id)); 
            return GetById(id) == null;
        }

        public void Update(UserBase userBase)
        {
            //var query = Query<UserBase>.EQ(e => e.Id, userBase.Id);
            //var update = Update<UserBase>.Replace(userBase); // update modifiers
            var builder = Builders<UserBase>.Filter;
            var filter = builder.Eq("Id", userBase.Id);
            //var update = Builders<UserBase>.Update. Set(userBase);
            //_database.GetCollection<UserBase>("UserBase").UpdateOneAsync(filter, update);  //Update(query, update);
        }

        
    }
}
