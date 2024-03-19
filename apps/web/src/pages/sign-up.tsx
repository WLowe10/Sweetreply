import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { signUpInputSchema } from "@replyon/shared/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpPage() {
	const signUpMutation = trpc.auth.signUp.useMutation();

	const form = useForm({
		resolver: zodResolver(signUpInputSchema),
	});

	// const handleSubmit = form.handleSubmit(() => {
	// 	signUpMutation.mutate({
	// 		name: form.getValues("name"),
	// 	});
	// });

	return <div className="min-h-screen flex justify-center items-center"></div>;
}
