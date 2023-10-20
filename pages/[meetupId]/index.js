import { Fragment } from "react";
import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://first-nextjs-app:dZmMHM1jN6Ei4clo@cluster0.66yviaf.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    // якщо встановити fallback: true, то окрім вказаних шляхів можуть динамічно генеруватись відсутні в списку шляхи
    //fallback: false, //вказує що нижче вказані всі необхідні шляхи, інакше буде показана помилка 404
    fallback: "blocking", //або true буде генерувати сторінку на вимогу, а потім кешувати, щоб попередньо згенерувати її за потреби
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() }, // встановили шлях, що міняється динамічно
    })),

    // [
    //   {
    //     params: {
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],
  };
}

export async function getStaticProps(context) {
  //fetch data from an API
  const meetupId = context.params.meetupId;

  console.log(meetupId); //відображається тільки в термінали vscode

  const client = await MongoClient.connect(
    "mongodb+srv://first-nextjs-app:dZmMHM1jN6Ei4clo@cluster0.66yviaf.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title.toString(),
        address: selectedMeetup.address.toString(),
        image: selectedMeetup.image.toString(),
        description: selectedMeetup.description.toString(),
      },
    },
  };
}

export default MeetupDetails;
