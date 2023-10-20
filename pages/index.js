import { Fragment } from "react";
import Head from "next/head";

import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A First Meetup",
//     image:
//       "https://img.freepik.com/free-photo/a-digital-painting-of-a-mountain-with-a-colorful-tree-in-the-foreground_1340-25699.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1697155200&semt=ais",
//     address: "Some address",
//     description: "This is a 1 meetup",
//   },
//   {
//     id: "m2",
//     title: "A Second Meetup",
//     image:
//       "https://img.freepik.com/free-photo/a-digital-painting-of-a-mountain-with-a-colorful-tree-in-the-foreground_1340-25699.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1697155200&semt=ais",
//     address: "Some address",
//     description: "This is a 2 meetup",
//   },
// ];

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>NextJS Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active NextJS meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// функція getServerSideProps ніколи не буде виконуватись на стороні клієнта, тільки на стороні сервера
//функція getServerSideProps не буде запускатись під час процесу збірки (build), а буде завжди на сервері після розгортання (deploy)
//функція getServerSideProps виконується для кожного вхідного запиту
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   //fetch data an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

//ЯКЩО НЕМАЄ АУТЕНТИФІКАЦІЇ І ДАНІ НЕ НАДХОДЯТЬ КОЖНУ СЕКУНДУ ТО КРАЩЕ ВИКОРИСТАТИ getStaticProps
//функція getStaticProps() викликається nextjs автоматично перед тим, як почне виконувати функцію компонента HomePage
// код функції getStaticProps() зазвичай виконується тільки на сервері, і ніколи не виконається на стороні клієнта
export async function getStaticProps() {
  //fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://first-nextjs-app:dZmMHM1jN6Ei4clo@cluster0.66yviaf.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1, //unlock a feature called incremental static generation, очікує число - час в секундах, скільки nextjs буде чекати, поки він перегенерує цю сторінку для вхідного запиту
  }; // в даному випадку означає, що сторінка з revalidate: 1 - буде регенеруватися на сервері кожні 1 секунд, якщо на неї надходитимуть запити
}

export default HomePage;
