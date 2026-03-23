/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */

import { Evaluation } from './evaluation.js';
import * as Messages from './messages.ts';
import { Simulation } from './simulation.js';

// TODO Some kind of rudimentary L20N based on navigator.language?

// Query tool strings
var densityStrings = ['Low Traffic', 'Medium Traffic', 'High Traffic', 'Congested'];
var landValueStrings = ['Deprecated', 'Legacy', 'Stable', 'Production'];
var crimeStrings = ['Secure', 'Minor Threats', 'Vulnerable', 'Breached'];
var pollutionStrings = ['Clean', 'Minor Leaks', 'Memory Bloat', 'Resource Exhaustion'];
var rateStrings = ['Losing Nodes', 'Stable', 'Scaling Up', 'Rapid Growth'];
var zoneTypes = ['Empty', 'Ocean', 'Cache', 'Rubble', 'DDoS Flood', 'Toxic Dump',
                 'Cascade Failure', 'HTTP Route', 'WireGuard', 'NATS Rail', 'Agent Housing', 'Service Endpoint',
                 'Compute Node', 'Ferry Terminal', 'Helipad', 'CPU Farm', 'Circuit Breaker',
                 'Firewall Station', 'Load Balancer', 'Hailo-8 Accelerator', 'Bridge Link',
                 'Radar Ping', 'Rest Area', 'Compute Node', 'Packet Score: 38-3',
                 'Bridge Link', 'Ur 238'];

// Evaluation window
var gameLevel = {};
gameLevel['' + Simulation.LEVEL_EASY] = 'Dev Mode';
gameLevel['' + Simulation.LEVEL_MED] = 'Production';
gameLevel['' + Simulation.LEVEL_HARD] = 'Black Friday';

var cityClass = {};
cityClass[Evaluation.CC_VILLAGE] = 'SEED NODE';
cityClass[Evaluation.CC_TOWN] = 'CLUSTER';
cityClass[Evaluation.CC_CITY] = 'NETWORK';
cityClass[Evaluation.CC_CAPITAL] = 'DATACENTER';
cityClass[Evaluation.CC_METROPOLIS] = 'MESH';
cityClass[Evaluation.CC_MEGALOPOLIS] = 'SOVEREIGN CLOUD';

var problems = {};
problems[Evaluation.CRIME] = 'Port Hogging';
problems[Evaluation.POLLUTION] = 'Memory Leaks';
problems[Evaluation.HOUSING] = 'Node Shortage';
problems[Evaluation.TAXES] = 'Resource Quotas';
problems[Evaluation.TRAFFIC] = 'Packet Congestion';
problems[Evaluation.UNEMPLOYMENT] = 'Idle Workers';
problems[Evaluation.FIRE] = 'Cascade Failure';

// months
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Tool strings
var toolMessages = {
  noMoney: 'Insufficient compute credits',
  needsDoze: 'Node must be decommissioned first'
};

// Message strings
var neutralMessages = {};
neutralMessages[Messages.FIRE_STATION_NEEDS_FUNDING] = true;
neutralMessages[Messages.NEED_AIRPORT] = true;
neutralMessages[Messages.NEED_FIRE_STATION] = true;
neutralMessages[Messages.NEED_ELECTRICITY] = true;
neutralMessages[Messages.NEED_MORE_INDUSTRIAL] = true;
neutralMessages[Messages.NEED_MORE_COMMERCIAL] = true;
neutralMessages[Messages.NEED_MORE_RESIDENTIAL] = true;
neutralMessages[Messages.NEED_MORE_RAILS] = true;
neutralMessages[Messages.NEED_MORE_ROADS] = true;
neutralMessages[Messages.NEED_POLICE_STATION] = true;
neutralMessages[Messages.NEED_SEAPORT] = true;
neutralMessages[Messages.NEED_STADIUM] = true;
neutralMessages[Messages.ROAD_NEEDS_FUNDING] = true;
neutralMessages[Messages.POLICE_NEEDS_FUNDING] = true;
neutralMessages[Messages.WELCOME] = true;

var badMessages = {};
badMessages[Messages.BLACKOUTS_REPORTED] = true;
badMessages[Messages.EARTHQUAKE] = true;
badMessages[Messages.EXPLOSION_REPORTED] = true;
badMessages[Messages.FLOODING_REPORTED] = true;
badMessages[Messages.FIRE_REPORTED] = true;
badMessages[Messages.HEAVY_TRAFFIC] = true;
badMessages[Messages.HELICOPTER_CRASHED] = true;
badMessages[Messages.HIGH_CRIME] = true;
badMessages[Messages.HIGH_POLLUTION] = true;
badMessages[Messages.MONSTER_SIGHTED] = true;
badMessages[Messages.NO_MONEY] = true;
badMessages[Messages.NOT_ENOUGH_POWER] = true;
badMessages[Messages.NUCLEAR_MELTDOWN] = true;
badMessages[Messages.PLANE_CRASHED] = true;
badMessages[Messages.SHIP_CRASHED] = true;
badMessages[Messages.TAX_TOO_HIGH] = true;
badMessages[Messages.TORNADO_SIGHTED] = true;
badMessages[Messages.TRAFFIC_JAMS] = true;
badMessages[Messages.TRAIN_CRASHED] = true;

var goodMessages = {};
goodMessages[Messages.REACHED_CAPITAL] = true;
goodMessages[Messages.REACHED_CITY] = true;
goodMessages[Messages.REACHED_MEGALOPOLIS] = true;
goodMessages[Messages.REACHED_METROPOLIS] = true;
goodMessages[Messages.REACHED_TOWN] = true;

var messageText = {};
messageText[Messages.FIRE_STATION_NEEDS_FUNDING] = 'Circuit breakers need funding';
messageText[Messages.NEED_AIRPORT] = 'Services require a Helipad for emergency routing';
messageText[Messages.NEED_FIRE_STATION] = 'Workers demand a Circuit Breaker station';
messageText[Messages.NEED_ELECTRICITY] = 'Build a WireGuard tunnel';
messageText[Messages.NEED_MORE_INDUSTRIAL] = 'More compute nodes needed';
messageText[Messages.NEED_MORE_COMMERCIAL] = 'More service endpoints needed';
messageText[Messages.NEED_MORE_RESIDENTIAL] = 'More agent housing needed';
messageText[Messages.NEED_MORE_RAILS] = 'Inadequate NATS pub/sub rail system';
messageText[Messages.NEED_MORE_ROADS] = 'More HTTP routes required';
messageText[Messages.NEED_POLICE_STATION] = 'Workers demand a Firewall Station';
messageText[Messages.NEED_SEAPORT] = 'Compute requires a Ferry Terminal for cross-ocean traffic';
messageText[Messages.NEED_STADIUM] = 'Agents demand a Load Balancer';
messageText[Messages.ROAD_NEEDS_FUNDING] = 'HTTP routes degrading, insufficient bandwidth';
messageText[Messages.POLICE_NEEDS_FUNDING] = 'Firewall stations need funding';
messageText[Messages.WELCOME] = 'Welcome to Roadopolis — The City of Routes';
messageText[Messages.BLACKOUTS_REPORTED] = 'Tunnel down! Build another WireGuard node';
messageText[Messages.EARTHQUAKE] = 'Major infrastructure failure reported !!';
messageText[Messages.EXPLOSION_REPORTED] = 'OOM Kill detected — process exploded';
messageText[Messages.FLOODING_REPORTED] = 'DDoS flood reported !';
messageText[Messages.FIRE_REPORTED] = 'Cascade failure spreading ';
messageText[Messages.HEAVY_TRAFFIC] = 'Heavy packet congestion reported';
messageText[Messages.HELICOPTER_CRASHED] = 'Emergency worker crashed ';
messageText[Messages.HIGH_CRIME] = 'Port hogging critical — resources being stolen';
messageText[Messages.HIGH_POLLUTION] = 'Memory leaks critical — garbage collection failing';
messageText[Messages.MONSTER_SIGHTED] = 'A Port Hog has been sighted !';
messageText[Messages.NO_MONEY] = 'YOUR NETWORK HAS RUN OUT OF CREDITS';
messageText[Messages.NOT_ENOUGH_POWER] = 'Nodes offline: insufficient WireGuard capacity';
messageText[Messages.NUCLEAR_MELTDOWN] = 'Hailo-8 thermal runaway — meltdown !!';
messageText[Messages.PLANE_CRASHED] = 'A broadcast packet was lost ';
messageText[Messages.SHIP_CRASHED] = 'Ferry lost at sea — TCP connection reset ';
messageText[Messages.TAX_TOO_HIGH] = 'Workers upset. Resource quotas too restrictive';
messageText[Messages.TORNADO_SIGHTED] = 'Log storm reported — disk filling fast !';
messageText[Messages.TRAFFIC_JAMS] = 'Packet loss exceeding threshold — trains not arriving';
messageText[Messages.TRAIN_CRASHED] = 'A NATS train derailed — messages lost ';
messageText[Messages.REACHED_CAPITAL] = 'Network has reached 50,000 workers — DATACENTER';
messageText[Messages.REACHED_CITY] = 'Network has reached 10,000 workers — NETWORK';
messageText[Messages.REACHED_MEGALOPOLIS] = 'Network has reached 500,000 workers — SOVEREIGN CLOUD';
messageText[Messages.REACHED_METROPOLIS] = 'Network has reached 100,000 workers — MESH';
messageText[Messages.REACHED_TOWN] = 'Network has reached 2,000 workers — CLUSTER';

var Text = {
  badMessages: badMessages,
  cityClass: cityClass,
  crimeStrings: crimeStrings,
  densityStrings: densityStrings,
  gameLevel: gameLevel,
  goodMessages: goodMessages,
  landValueStrings: landValueStrings,
  messageText: messageText,
  months: months,
  neutralMessages: neutralMessages,
  problems: problems,
  pollutionStrings: pollutionStrings,
  rateStrings: rateStrings,
  toolMessages: toolMessages,
  zoneTypes: zoneTypes
};

export { Text };
