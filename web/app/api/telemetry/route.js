import {NextResponse} from "next/server";
import {getDb} from "@/lib/db";
export async function POST(request){
 try{
  const key=process.env.TELEMETRY_API_KEY, supplied=request.headers.get("x-telemetry-key");
  if(!key||supplied!==key)return NextResponse.json({error:"Unauthorized telemetry request"},{status:401});
  const body=await request.json();
  const {driverId,game,speed=0,fuel=null,odometer=null,latitude=null,longitude=null,payload={}}=body;
  if(!driverId||!game)return NextResponse.json({error:"driverId and game are required"},{status:400});
  const normalized=String(game).toUpperCase();
  if(!["ATS","ETS2"].includes(normalized))return NextResponse.json({error:"game must be ATS or ETS2"},{status:400});
  const db=getDb();
  const previous=await db.query("select odometer from telemetry where driver_id=$1 and game=$2 order by captured_at desc limit 1",[driverId,normalized]);
  const previousOdo=previous.rows[0]?.odometer==null?null:Number(previous.rows[0].odometer);
  const currentOdo=odometer==null?null:Number(odometer);
  const delta=currentOdo!=null&&previousOdo!=null&&currentOdo>=previousOdo?currentOdo-previousOdo:0;
  const result=await db.query("insert into telemetry (driver_id,game,speed,fuel,odometer,latitude,longitude,payload) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id,captured_at",[driverId,normalized,speed,fuel,odometer,latitude,longitude,payload]);
  if(delta>0&&delta<100){
   await db.query("update drivers set total_miles=coalesce(total_miles,0)+$1,updated_at=now() where id=$2",[delta,driverId]);
  }
  return NextResponse.json({ok:true,telemetry:result.rows[0],milesAdded:delta});
 }catch(error){return NextResponse.json({error:"Telemetry service unavailable"},{status:503});}
}