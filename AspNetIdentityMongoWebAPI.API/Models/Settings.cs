using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AspNetIdentityMongoWebAPI.API.Models
{
    public class Settings
    {
        public string Database { get; set; }
        public string MongoConnection { get; set; }
    }

    public interface ISettings
    {
         string Database { get; set; }
         string MongoConnection { get; set; }
    }
}

