using AspNetIdentityMongoWebAPI.API.Context;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AspNetIdentityMongoWebAPI.API.Models
{
    public interface IUserBase
    {
        IEnumerable<UserBase> AllUserBase();

        UserBase GetById(ObjectId id);

        void Add(UserBase userBase);

        void Update(UserBase userBase);

        bool Remove(ObjectId id);
    }
}
