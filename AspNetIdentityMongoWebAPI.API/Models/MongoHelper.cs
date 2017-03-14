using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AspNetIdentityMongoWebAPI.API.Models
{
    public class MongoHelper<T> where T : class
    {
        public IMongoCollection<T> Collection { get; private set; }

        public MongoHelper()
        {
            //var con = new IMongoConnectionStringBuilder(
            //    ConfigurationManager.ConnectionStrings["MongoDB"].ConnectionString);
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("DamorelDB");
            //var server = MongoServer.Create(con);
            //var db = server.GetDatabase(con.DatabaseName);
            Collection = database.GetCollection<T>(typeof(T).Name.ToLower());
        }
    }
}
