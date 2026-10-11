export const MAPS=[
 {name:'Training Valley',theme:'valley',sky:0xaddbea,ground:0x67a875,wind:0,amp:22,height:9,spacing:155,radius:22,count:14,phase:.43,description:'Wide gates, gentle turns, calm air. Start here.'},
 {name:'Coral Coast',theme:'coast',sky:0x85d1e9,ground:0x277e9a,wind:.6,amp:52,height:18,spacing:175,radius:20,count:16,phase:.6,description:'Island chain, turquoise sea and sweeping turns.'},
 {name:'Neon Metropolis',theme:'city',sky:0x11162c,ground:0x121827,wind:1.2,amp:68,height:27,spacing:190,radius:18,count:16,phase:.66,description:'Night skyline with bright route markers.'},
 {name:'Amber Dunes',theme:'desert',sky:0xf0bb82,ground:0xb98b54,wind:1,amp:88,height:15,spacing:185,radius:20,count:18,phase:.58,description:'Warm sunset, desert arches and rolling dunes.'},
 {name:'Aurora Fjords',theme:'ice',sky:0x0b253b,ground:0x527e97,wind:1.8,amp:65,height:35,spacing:185,radius:18,count:16,phase:.64,description:'Snow peaks, ice shelves and northern lights.'},
 {name:'Thunder Pass',theme:'storm',sky:0x3c5062,ground:0x304b48,wind:3,amp:92,height:30,spacing:190,radius:21,count:18,phase:.56,description:'Dark clouds, gusts and lightning. The hardest course.'},
 {name:'Downtown Drone Run',theme:'street',sky:0x9bbacb,ground:0x626966,wind:.3,amp:10,height:2,spacing:95,radius:4,count:24,phase:1.1,low:true,description:'Street-level slalom: solid lamps, buses, barriers and overhead bridges. Drone recommended.'},
 {name:'Industrial Harbor',theme:'harbor',sky:0xc9b6a0,ground:0x5b6267,wind:.8,amp:10,height:2,spacing:95,radius:4,count:24,phase:1.1,low:true,description:'Thread between shipping containers, cranes, lamps and loading gantries. Drone recommended.'}
];
export const VEHICLES={
 trainer:{name:'Trainer Plane',speed:48,boost:1.3,turn:1,climb:1,kind:'plane',description:'Stable handling with a faster cruise.'},
 jet:{name:'Swift Jet',speed:82,boost:1.5,turn:.82,climb:1.2,kind:'jet',description:'Fast with a wider turning radius.'},
 glider:{name:'Cloud Glider',speed:44,boost:1.15,turn:.86,climb:.8,kind:'glider',description:'Long wings and smooth, gentle flight.'},
 drone:{name:'Quad Drone',speed:34,boost:1.5,turn:1.5,climb:1.3,kind:'drone',hover:true,description:'Direct sideways control, altitude hold. Space to hover.'},
 airship:{name:'Sky Airship',speed:28,boost:1.25,turn:.65,climb:.6,kind:'airship',hover:true,description:'Very slow cruise and gentle vertical movement.'}
};
export const DIFFICULTIES={
 rookie:{name:'Rookie',speed:.72,delay:4,reaction:.45,error:.3,missEvery:3,description:'Slower, a four-second head start, and occasional missed gates.'},
 casual:{name:'Casual',speed:.88,delay:2,reaction:.22,error:.12,missEvery:6,description:'Moderate pace with occasional mistakes.'},
 skilled:{name:'Skilled',speed:1,delay:0,reaction:.08,error:.025,missEvery:0,description:'Full speed and accurate steering.'},
 expert:{name:'Expert',speed:1.06,delay:0,reaction:0,error:0,missEvery:0,description:'Fast, precise and uses the evolved controller.'}
};
export const MODES={race:{name:'Gate Race',description:'Race the AI. Each missed gate adds 6 seconds to your finish time.'},time:{name:'Time Trial',description:'Beat your saved best time. Each missed gate adds 6 seconds.'},practice:{name:'Practice',description:'Learn the course without an opponent or time pressure.'},hunt:{name:'Sky Hunt',description:'Collect glowing sky orbs during a 90-second flight.'},survival:{name:'Sky Survival',description:'Dodge red hazards and stay in the flight corridor for 60 seconds. Three lives.'},free:{name:'Free Flight',description:'Explore at your own pace. No gates or opponent. Collect landmark targets.'}};
export function configuration(vehicle='trainer',assist='guided'){return {vehicle,assist,...VEHICLES[vehicle]};}
