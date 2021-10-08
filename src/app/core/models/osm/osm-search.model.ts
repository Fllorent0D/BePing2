export interface OSMAddressDetails {
    house_number: string;
    road: string;
    village: string;
    municipality: string;
    county: string;
    state: string;
    region: string;
    postcode: string;
    country: string;
    country_code: string;
}

export interface OSMAddress {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    address: OSMAddressDetails;
}
