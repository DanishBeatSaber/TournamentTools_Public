function changeScoreline(player,score) {
    if (P1 == jsonObj.PlayerIds[0]) {
        switch (jsonObj.Score[0]) {
            case "0":
                document.getElementById("l1").style.opacity = 0;
                document.getElementById("l2").style.opacity = 0;
                document.getElementById("l3").style.opacity = 0;
                document.getElementById("l4").style.opacity = 0;
                document.getElementById("l5").style.opacity = 0;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "1":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 0;
                document.getElementById("l3").style.opacity = 0;
                document.getElementById("l4").style.opacity = 0;
                document.getElementById("l5").style.opacity = 0;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "2":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 0;
                document.getElementById("l4").style.opacity = 0;
                document.getElementById("l5").style.opacity = 0;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "3":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 1;
                document.getElementById("l4").style.opacity = 0;
                document.getElementById("l5").style.opacity = 0;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "4":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 1;
                document.getElementById("l4").style.opacity = 1;
                document.getElementById("l5").style.opacity = 0;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "5":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 1;
                document.getElementById("l4").style.opacity = 1;
                document.getElementById("l5").style.opacity = 1;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "6":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 1;
                document.getElementById("l4").style.opacity = 1;
                document.getElementById("l5").style.opacity = 1;
                document.getElementById("l6").style.opacity = 1;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "7":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 1;
                document.getElementById("l4").style.opacity = 1;
                document.getElementById("l5").style.opacity = 1;
                document.getElementById("l6").style.opacity = 1;
                document.getElementById("l7").style.opacity = 1;
                break;
            default:
                break;
        }
    }
    if (P2 == jsonObj.PlayerIds[1]) {
        switch (jsonObj.Score[1]) {
            case "0":
                document.getElementById("r1").style.opacity = 0;
                document.getElementById("r2").style.opacity = 0;
                document.getElementById("r3").style.opacity = 0;
                document.getElementById("r4").style.opacity = 0;
                document.getElementById("r5").style.opacity = 0;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "1":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 0;
                document.getElementById("r3").style.opacity = 0;
                document.getElementById("r4").style.opacity = 0;
                document.getElementById("r5").style.opacity = 0;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "2":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 0;
                document.getElementById("r4").style.opacity = 0;
                document.getElementById("r5").style.opacity = 0;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "3":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 1;
                document.getElementById("r4").style.opacity = 0;
                document.getElementById("r5").style.opacity = 0;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "4":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 1;
                document.getElementById("r4").style.opacity = 1;
                document.getElementById("r5").style.opacity = 0;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "5":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 1;
                document.getElementById("r4").style.opacity = 1;
                document.getElementById("r5").style.opacity = 1;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "6":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 1;
                document.getElementById("r4").style.opacity = 1;
                document.getElementById("r5").style.opacity = 1;
                document.getElementById("r6").style.opacity = 1;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "7":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 1;
                document.getElementById("r4").style.opacity = 1;
                document.getElementById("r5").style.opacity = 1;
                document.getElementById("r6").style.opacity = 1;
                document.getElementById("r7").style.opacity = 1;
                break;
            default:
                break;
        }
    }

}