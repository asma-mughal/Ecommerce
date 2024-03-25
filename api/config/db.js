import moongose from 'moongose';
export const connectDB = async() => {
    try {
        const conn = await moongose.connect(process.env.DATABASE_URI);
        console.log('Successfully Connected')
    } catch (err)
    {
        console.log(err, "Error connecting DB")
    }
}