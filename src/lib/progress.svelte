<script>
	export let currentProgress;
	export let currentItemNumber;
	export let totalItems;
</script>

<progress max="100" value={currentProgress} />
<span><h5>{currentItemNumber} of {totalItems}</h5></span>

<style>
	progress {
		display: inline-block;
		margin-right: 10px;
		margin-top: 10px;
		width: 80%;
		height: 30px;
        align-self: center;
	}
	span {
		vertical-align: top;
		margin-left: 10px;
		display: inline-block;
	}
</style>
