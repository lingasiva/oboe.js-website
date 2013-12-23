var scenarios = (function () {
    
    /* some more:
     * jQ fast
     * Oboe fast
     * jQ mobile
     * Oboe mobile
     * jQ mobile, failing
     * Oboe mobile, failing
     * streaming + historic together
     * a chat session
     * creating an aggregation (Insight) jQ
     * creating an aggregation (Insight) Oboe
     */

    return {
        "2-node-layout":{            
            "items": [
                {
                    "name": "sever",
                    "type": "server",
                    "options": {
                        "timeBetweenPackets": 100,
                        "initialDelay": 500,
                        "messageSize": 9
                    }
                },
                {
                    "name": "internet",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 1500
                    }
                },
                {
                    "name": "client",
                    "type": "client",
                    "options": {
                        "page": "singlePageSite",
                        "deviceType":"desktop"
                    }
                }
            ]            
        },
        
        "fast-ajax-discrete": {
            "baseOn":"2-node-layout",
            "extensions":{
                "items":[
                    ,,{
                        options:{
                            parseStrategy:"discrete"
                        }
                    }
                ]
            }
        }, 
        
        "fast-ajax-progressive": {
            "baseOn":"2-node-layout",
            "extensions":{
                "items":[
                    ,,{
                        options:{
                            parseStrategy:"progressive"
                        }
                    }
                ]
            }
        },

        "mobile-layout":{
            "items": [
                {
                    "name": "sever",
                    "type": "server",
                    "options": {
                        "timeBetweenPackets": 50,
                        "initialDelay": 500,
                        "messageSize": 10,
                        "packetMode": "historic"
                    },
                    locations:{
                        where: {x: 40, y: 93}
                    }
                },
                {
                    "name": "internet-wire",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 800,
                        "messageSize": 7
                    }                    
                },
                {
                    "name": "tower",
                    "type": "relay",
                    "options":{
                        "timeBetweenPackets": inconsistent_packet_spacing
                    }
                },                
                {
                    "name": "internet-gsm",
                    "type": "wire",
                    "options": {
                        "medium":"mobile",
                        "bandwidth": 500,
                        "latency": 800,
                        "messageSize": 7
                    }
                },
                {
                    "name": "client",
                    "type": "client",
                    "options": {
                        "page": "map",
                        "deviceType":"mobile"
                    },
                    "next":[]
                }
            ]            
        },
        
        "mobile-discrete": {
            "baseOn":"mobile-layout",
            "extensions":{
                "items": [
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "discrete"
                        }
                    }
                ]
            }
        },

        "mobile-progressive": {
            "baseOn":"mobile-layout",
            "extensions":{
                "items": [
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "progressive"
                        }                    
                    }
                ]
            }
        },

        "mobile-fail":{
            "baseOn":"mobile-layout",
            "extensions":{
                "items": [
                    ,,
                    {
                        "locations": {
                            "where":     {x:190, y:80}
                        }
                    }
                    ,
                    {
                        "relationships":{
                            "blockedBy":"tunnel"
                        }
                    }
                    ,
                    {   "options":{
                            "retryAfter": seconds(5)
                        }
                    }
                    ,
                    {
                        "name":"tunnel",
                        "type":"barrier",
                        "script": {
                            "client_accepted_response6": function(){
                                this.activateIfNeverShownBefore();
                            },
                            "client_requestAttempt_1": function(){
                                this.schedule(function(){
                                    this.deactivate();
                                }, seconds(3));
                            }
                        }
                    }
                ]
            }            
        },
        
        "mobile-fail-discrete": {
            "baseOn":"mobile-fail",
            "extensions":{
                "items": [
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "discrete"
                        }
                    }
                ]
            }
        },

        "mobile-fail-progressive": {
            "baseOn":"mobile-fail",
            "extensions":{
                "items": [
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "progressive"
                        }
                    }
                ]
            }
        },

        "aggregated-layout":{
            "options":{
                "height":257,
                "colors":"twoSeries"
            },
            "items": [
                {
                    "name": "origin-slow",
                    "type": "server",
                    "options": {
                        "timeBetweenPackets": 2000,
                        "initialDelay": 500,
                        "messageSize": 9,
                        "packetSequence": evenNumberedPackets
                    }
                },
                {
                    "name": "origin-slow-wire",
                    "type": "wire",
                    "next":["aggregator"],
                    "options": {
                        "bandwidth": 500,
                        "latency": 1200
                    }
                },
                {
                    "name": "origin-fast",
                    "type": "server",
                    "options": {
                        "timeBetweenPackets": 750,
                        "initialDelay": 250,
                        "messageSize": 10,
                        "packetSequence": oddNumberedPackets
                    },
                    "locations":{ "where":{x:100, y:200} }
                },
                {
                    "name": "origin-fast-wire",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 800
                    }
                },
                {
                    "name": "aggregator",
                    "type": "aggregatingServer",
                    "options": {
                        "timeBetweenPackets": 1000,
                        "initialDelay": 500,
                        "messageSize": Number.POSITIVE_INFINITY
                    },
                    "locations":{ "where":{x:240, y:125} }
                },
                {
                    "name": "client-internet",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 1000
                    }
                },
                {
                    "name": "client",
                    "type": "client",
                    "options": {
                        "parseStrategy": "progressive",
                        "page": "graph",
                        "aspect": "landscape",
                        "deviceType":"desktop"
                    },
                    "locations":{ "where":{x:420, y:125} }
                }
            ]
        },
        
        "aggregated-discrete": {
            
            "baseOn":"aggregated-layout",
            "extensions":{
                "items":[
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "discrete"
                        }
                    }
                    ,,
                    {
                        "options":{
                            "parseStrategy": "discrete"
                        }
                    }
                ]
            }
        },
        
        "aggregated-progressive": {

            "baseOn":"aggregated-layout",
            "extensions":{
                "items":[
                    ,,,,
                    {
                        "options": {
                            "parseStrategy": "progressive"
                        }
                    }
                    ,,{
                        "options":{
                            "parseStrategy": "progressive"
                        }
                    }
                ]                
            }
        },
        
        "historic-and-live": {
            "items": [
                {
                    "name": "server",
                    "type": "server",
                    "options": {
                        "timeBetweenPackets": fastTimingThenStream,
                        "packetMode": historicPacketsThenLive,
                        "initialDelay": 500,
                        "messageSize": Number.POSITIVE_INFINITY
                    }
                },
                {
                    "name": "internet",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 1000
                    }
                },
                {
                    "name": "client",
                    "type": "client",
                    "options": {
                        "parseStrategy": "progressive",
                        "page": "twitter",
                        "deviceType":"desktop"
                    }
                }
            ]
        },

        "caching": {
            "options":{
                "height":257,
                "colors":"twoSeries"
            },
            "items": [
                {
                    "name": "server",
                    "type": "server",
                    "options": {
                        "messageSize": 10
                    }
                },
                {
                    "name": "server-wire",
                    "type": "wire",
                    "options": {
                        "bandwidth": 500,
                        "latency": 1000
                    }
                },
                {
                    "name": "cache",
                    "type": "relay",
                    "next": ["internet1", "internet2"]
                },
                {
                    "name": "internet1",
                    "type": "wire"
                },
                {
                    "name": "client",
                    "type": "client",
                    "options": {
                        "parseStrategy": "progressive",
                        "page": "twitter",
                        "deviceType":"desktop"
                    },
                    "locations":{ "where":{x:420, y:75} },
                    "next": []
                },
                {
                    "name": "internet2",
                    "type": "wire"
                },
                {
                    "name": "client2",
                    "type": "client",
                    "options": {
                        "parseStrategy": "progressive",
                        "page": "twitter",
                        "deviceType":"desktop"
                    },
                    "locations":{ "where":{x:420, y:200} }
                }
            ]
        }
    };

    function inconsistent_packet_spacing(i) {

        switch(i){
            case 0:
            case 1:
            case 5:
            case 6:
                return 75; // fast    
        }
        return 600; //slow
    }

    function randomBetween(min, max) {
        var range = (max - min);
        return min + (Math.random() * range);
    }

    function fastTimingThenStream(i){

        return (i < 6 ? 100 : randomBetween(750, 2500));
    }

    function historicPacketsThenLive(i) {
        return (i < 6 ? 'historic' : 'live');
    }

    function evenNumberedPackets(i) {
        return (i === -1)?
            0 : i+=2;
    }

    function oddNumberedPackets(i) {
        return (i === -1)?
            1 : i+=2;
    }
    
    function seconds(s){
        return 1000 * s;
    }
    
    
})();   
