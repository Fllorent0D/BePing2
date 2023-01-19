/* tslint:disable */
/* eslint-disable */
import {TournamentSerieEntry} from './tournament-serie-entry';

export interface TournamentEntry {
    DateFrom: string;
    DateTo: string;
    ExternalIndex: string;
    Level: 'NATIONAL' | 'HAINAUT' | 'VLAAMS_BRABANT_BR' | 'SUPER_DIVISION' | 'OOST_VLANDEREN' | 'ANTWERP' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'BRUSSELS_BRABANT_WALLON' | 'NAMUR' | 'LIEGE' | 'LUXEMBOURG' | 'REGION_VTTL' | 'IWB';
    Name: string;
    RegistrationDate: string;
    SerieCount: number;
    SerieEntries: Array<TournamentSerieEntry>;
    UniqueIndex: number;
    Venue?: {
        Name: string;
        Street: string;
        Comment: string;
        Town: string;
    };
}
