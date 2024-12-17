// import { createClient } from "@/utils/supabase/server";

// export const getGenerationsRemainingAction = async () => {
//     const supabase = await createClient();
//     const { data } = await supabase.from("users").select("generations_remaining").limit(1);
//     if (!data) {
//         return 0;
//     }
//     return data[0].generations_remaining;
// }