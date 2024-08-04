import { createHttp1Request, type Credentials } from "league-connect";
import { pb, admin } from "../utils/pocketbase";

class Event {
    eventId: string = "";
    eventName: string = "";
    eventIcon: string = "";
    eventTokenImage: string = "";
    eventType: string = "";
    helpModalImagePath: string = "";
    eventStartDate: string = "";
    eventEndDate: string = "";
    shopEndDate: string = "";
    shopOffers: string = "";
}

export async function eventsFetch(credentials: Credentials) {

    const temp = await createHttp1Request({
        method: 'GET',
        url: 'lol-event-hub/v1/events'
    }, credentials);

    const currentEvents: any[] = await temp.json();
    await admin();

    for(const event of currentEvents)
    {
        const eventId = event.eventId;
        const checkIfEventExists = await pb.collection('events').getFullList({filter: `eventId="${eventId}"`});

        const temp1 = await createHttp1Request({
            method: 'GET',
            url: `lol-event-hub/v1/events/${eventId}/event-details-data`
        }, credentials);

        const temp2 = await createHttp1Request({
            method: 'GET',
            url: `lol-event-hub/v1/events/${eventId}/token-shop/categories-offers`
        }, credentials);

        const eventDetails: Event = temp1.json();
        const eventOffers: Event = temp2.json();

        const eventObject = new Event();
        const formData = new FormData();

        eventObject.eventId = event.eventId;
        eventObject.eventName = event.eventInfo.eventName;
        eventObject.eventEndDate = eventDetails.progressEndDate;
        eventObject.eventStartDate = eventDetails.eventStartDate;
        eventObject.shopEndDate = eventDetails.shopEndDate;
        eventObject.shopOffers = JSON.stringify(eventOffers);
        eventObject.eventType = event.eventInfo.eventType;

        eventObject.eventIcon = `https://127.0.0.1:${credentials.port}` + event.eventInfo.eventIcon;
        eventObject.eventTokenImage = `https://127.0.0.1:${credentials.port}` + event.eventInfo.eventTokenImage;
        eventObject.helpModalImagePath =  `https://127.0.0.1:${credentials.port}` + eventDetails.helpModalImagePath;

        var headers = new Headers({
            'Authorization': `Basic ${btoa("riot" + ':' + credentials.password)}`
        });
        
        let blob = await fetch(eventObject.eventIcon, {headers: headers}).then(r => r.blob());
        formData.append('eventIcon', blob);

        blob = await fetch(eventObject.eventTokenImage, {headers: headers}).then(r => r.blob());
        formData.append('eventTokenImage', blob);

        blob = await fetch(eventObject.helpModalImagePath, {headers: headers}).then(r => r.blob());
        formData.append('helpModalImagePath', blob);

        formData.append('eventId', eventObject.eventId);
        formData.append('eventName', eventObject.eventName);
        formData.append('eventEndDate', eventObject.eventEndDate);
        formData.append('eventStartDate', eventObject.eventStartDate);
        formData.append('shopEndDate', eventObject.shopEndDate);
        formData.append('shopOffers', eventObject.shopOffers);
        formData.append('eventType', eventObject.eventType);

        if (checkIfEventExists.length > 0) {
            const request = await pb.collection('events').update(checkIfEventExists[0].id, formData);
            console.log("Updated event entry with ID: " + request.id);
            continue;
        }
        const request = await pb.collection('events').create(formData);
        console.log("Created new event entry with ID: " + request.id);
    }

    return currentEvents;
}