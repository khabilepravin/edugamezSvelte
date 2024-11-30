<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';
</script>

<div
	wire:loading
	class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
>
	<ProgressRadial ... stroke={40} meter="stroke-secondary-500" track="stroke-secondary-500/30" width="w-20" />
</div>