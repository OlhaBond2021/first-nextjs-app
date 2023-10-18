import { MongoClient } from "mongodb";

// /api/new-meetup
//код виконується тільки на стороні сервера, коли запит надсилається на цей маршрут

//POST /api/new-meetup
async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    // const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      "mongodb+srv://first-nextjs-app:dZmMHM1jN6Ei4clo@cluster0.66yviaf.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne(data); //автоматично генерується id вставленого об'єкта (дані, які відправляються на сервер)

    console.log(result);
    //на цьому етапі можна обробити помилки
    client.close(); // закрити з'єднання з базою даних

    res.status(201).json({ message: "Meetup inserted!" }); //201 - відправлено успішно
  }
}

export default handler;
