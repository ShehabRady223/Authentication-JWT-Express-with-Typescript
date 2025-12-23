import bcrypt from 'bcrypt';

export async function hashValue(value: string, saltRating?: number) {
    return bcrypt.hash(value, saltRating || 10)
}

export async function compareValue(value:string,hashValue:string) {
    //catch(()=>false
    return bcrypt.compare(value,hashValue).catch(()=>false)
}



