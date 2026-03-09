Here we have sensor(Event Generator) transmit data(event) to core, further IoT core rule pushes data to Lambda.
But there exist no such lambda(Event Consumer)as specified in the rule to handle that event. So Event is Orphan. 
Such orphan events can be identified through event coverage.