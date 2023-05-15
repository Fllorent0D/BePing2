import {NumericRankingDetailsV3} from '../../api/models/numeric-ranking-details-v-3';
import {format} from 'date-fns';
import {EVENT_TYPE} from '../../models/points';
import {NumericRankingPerWeekOpponentsV3} from '../../api/models/numeric-ranking-per-week-opponents-v-3';

export const parseBaseAndEndPoints = (pointsStr: string): number[] => {
    const regex = /[a-z\s]+\s:\s([0-9.]+)/gm;
    const results: number[] = [];
    let m;
    while ((m = regex.exec(pointsStr)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        results.push(Number(m[1]));
    }
    return results;
};

export const parseTableForHistory = (tableHtml: HTMLTableElement): NumericRankingDetailsV3[] => {
    const results = [];

    const tBodies: HTMLCollectionOf<HTMLTableSectionElement> = tableHtml.tBodies;
    // body > div.content > div.table-responsive > table
    if (tBodies.length) {
        const firstTBody = tBodies.item(0);
        let dateHistoryItem: NumericRankingDetailsV3;
        // @ts-ignore
        for (const line of firstTBody.rows) {
            if (!['TabWin', 'TabLoose'].includes(line.className)) {
                if (dateHistoryItem) {
                    results.push(dateHistoryItem);
                }
                // parse weekname line
                const cellContent = line.cells[0].textContent.trim();
                const [context, pointsSummary] = cellContent.split(' | ');
                const [date, competition, ...club] = context.split(' - ');
                const [day, month, year] = date.split('/').map(Number);
                const [basePoints, endPoints] = parseBaseAndEndPoints(pointsSummary);
                dateHistoryItem = {
                    date: format(new Date(year, month - 1, day), 'yyyy-MM-dd'),
                    basePoints,
                    endPoints,
                    competitionType: club.length ? EVENT_TYPE.CHAMPIONSHIP : EVENT_TYPE.TOURNAMENT,
                    competitionContext: competition,
                    opponents: [],
                };
            } else {
                // parse result
                if (!dateHistoryItem) {
                    continue;
                }
                const opponent: NumericRankingPerWeekOpponentsV3 = {
                    opponentName: line.cells[1].textContent,
                    score: line.cells[2].textContent,
                    opponentRanking: line.cells[3].textContent,
                    opponentNumericRanking: Number(line.cells[4].textContent),
                    pointsWon: Number(line.cells[5].textContent.slice(0, -3)),
                };
                dateHistoryItem.opponents.push(opponent);
            }
        }
        results.push(dateHistoryItem);
    }
    return results;
};
