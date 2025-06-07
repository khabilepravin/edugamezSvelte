<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	//import { toastStore } from '@skeletonlabs/skeleton';

	let formData = {
		name: '',
		description: '',
		class: ''
	};

	let files: FileList;

	function onFileUpload(event: CustomEvent<FileList>) {
		files = event.detail;
		// Validate file types
		if (files && files.length > 0) {
			const file = files[0];
			const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
			if (!validTypes.includes(file.type)) {
                console.log('Please upload only PDF or image files (JPG, PNG)');
				// toastStore.trigger({
				// 	message: 'Please upload only PDF or image files (JPG, PNG)',
				// 	background: 'variant-filled-error'
				// });
				files = null;
			}
		}
	}

	async function handleSubmit() {
		// TODO: Implement form submission logic
		console.log('Form Data:', formData);
		console.log('Files:', files);
	}
</script>

<svelte:head>
    <title>Create New List | MaxSpelling</title>
</svelte:head>

<div class="container mx-auto p-4 max-w-2xl">
    <div class="mb-8">
        <h2 class="h2">Create New List</h2>
        <p class="text-surface-600">Create a new spelling list by uploading a file</p>
    </div>
	<!-- File Upload -->
	<div class="space-y-2">
        <label class="label">
            <span>List Name</span>
            <input
                class="input px-4 py-2"
                type="text"
                placeholder="Enter list name"
                bind:value={formData.name}
                required
            />
        </label>

        <!-- Description -->
        <label class="label">
            <span>Description</span>
            <textarea
                class="textarea px-4 py-2"
                rows="3"
                placeholder="Enter list description"
                bind:value={formData.description}
            ></textarea>
        </label>

        <!-- Class Selection -->
        <label class="label">
            <span>Class</span>
            <select class="select px-4 py-2" bind:value={formData.class} required>
                <option value="">Select a class</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
            </select>
        </label>

		<span class="label">Upload Word List</span>
		<FileDropzone name="files" accept=".pdf,.jpg,.jpeg,.png" on:change={onFileUpload}>
			<svelte:fragment slot="lead">
				<div class="flex justify-center p-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-10 w-10 text-surface-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
				</div>
			</svelte:fragment>
			<p class="text-center">Drag and drop your file here</p>
			<p class="text-center text-sm text-surface-500">Supported formats: PDF, JPG, PNG</p>
		</FileDropzone>

        <div class="flex justify-end gap-4 pt-6 border-t">
            <a 
                href="/spelling/mylists" 
                class="btn variant-soft-surface"
            >
                Cancel
            </a>
            <button 
                type="submit" 
                class="btn variant-filled-primary"
                on:click={handleSubmit}
            >
                Create List
            </button>
        </div>
	</div>

	<!-- ...existing code... -->
</div>
