import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import {
    useSession,
    useSupabaseClient,
    useUser,
} from "@supabase/auth-helpers-react";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ExerciseCard from "../../components/ExerciseCard";
import Link from "next/link";

const Exercises = () => {
    const supabase = useSupabaseClient();
    const session = useSession();
    const user = useUser();
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [exercises, setExercises] = useState<any[] | null>([]); // list of exercises
    const [loading, setLoading] = useState(true);

    const { workout_id } = router.query;

    async function getExercises() {
        try {
            setLoading(true);

            let { data, error, status } = await supabase
                .from("exercises")
                .select(`*`)
                .eq("user_id", user?.id)
                .order("inserted_at", { ascending: false });
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                console.log(user?.id);
                console.log(workout_id);
                setExercises(data);
            }
        } catch (error) {
            console.log(workout_id);
            console.log("No exercises");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const getExercisesFromWorkout = async () => {
            if (router.isReady) {
                let { data } = await supabase
                    .from("exercises")
                    .select(`*`)
                    .filter("workout_id", "eq", workout_id)
                    .order("inserted_at", { ascending: false });
                setExercises(data);
                console.log(data);
                console.log(workout_id);
                console.log(router.query);
            }
        };
        getExercisesFromWorkout();
    }, [workout_id, router.isReady, router.query, loading]);

    useEffect(() => {
        async function getUsername() {
            try {
                setLoading(true);
                let { data, error, status } = await supabase
                    .from("profiles")
                    .select(`username`)
                    .eq("id", user?.id)
                    .single();

                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    setUsername(data.username);
                }
            } catch (error) {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }

        getUsername();
    }, [session, router, supabase, user?.id, workout_id]);

    const handleDelete = async (id: number) => {
        try {
            const { data, error } = await supabase
                .from("exercises")
                .delete()
                .eq("id", id)
                .eq("user_id", user?.id);
            getExercises();
            if (error) throw error;
            alert("Workout deleted successfully");
        } catch (error: any) {
            alert(error.message);
        }
    };
    return (
        <>
            <Navbar session={session}></Navbar>
            {username ? (
                <div className={styles.container}>
                    Here are the exercises from {workout_id}
                </div>
            ) : (
                <div className={styles.container}>
                    Welcome lifter. Go to account and enter your details!
                </div>
            )}
            <div className={styles.container}>
                <Link href="/create/new_exercise">
                    <button
                        className={styles.button}
                        style={{
                            textAlign: "center",
                            marginTop: "5%",
                            marginBottom: "5%",
                        }}
                    >
                        Create New<br></br> Exercise
                    </button>
                </Link>
            </div>
            <div className={styles.container}>
                {exercises?.length === 0 ? (
                    <div>
                        <p>There are no exercises yet</p>
                    </div>
                ) : (
                    <div className={styles.container}>
                        <p>Here are your exercises:</p>
                        <ExerciseCard
                            data={exercises}
                            handleDelete={handleDelete}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default Exercises;
